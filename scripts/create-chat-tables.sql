-- Create chat rooms table
CREATE TABLE IF NOT EXISTS chat_rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'support' NOT NULL, -- support, general, etc.
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
    sender_username VARCHAR(255) NOT NULL,
    sender_email VARCHAR(255),
    message TEXT NOT NULL,
    is_staff BOOLEAN DEFAULT FALSE,
    message_type VARCHAR(50) DEFAULT 'text', -- text, system, file, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat participants table (to track who's in which room)
CREATE TABLE IF NOT EXISTS chat_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    is_staff BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_online BOOLEAN DEFAULT TRUE,
    UNIQUE(room_id, username)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_participants_room_id ON chat_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_username ON chat_participants(username);

-- Create default support chat room
INSERT INTO chat_rooms (name, type) 
VALUES ('General Support', 'support')
ON CONFLICT DO NOTHING;

-- Enable realtime for chat tables
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_participants;

-- Create function to update participant last_seen
CREATE OR REPLACE FUNCTION update_participant_last_seen()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chat_participants 
    SET last_seen = NOW(), is_online = TRUE
    WHERE room_id = NEW.room_id AND username = NEW.sender_username;
    
    -- If participant doesn't exist, create them
    IF NOT FOUND THEN
        INSERT INTO chat_participants (room_id, username, sender_email, is_staff, is_online)
        VALUES (NEW.room_id, NEW.sender_username, NEW.sender_email, NEW.is_staff, TRUE)
        ON CONFLICT (room_id, username) DO UPDATE SET
            last_seen = NOW(),
            is_online = TRUE;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update participant status when message is sent
CREATE TRIGGER trigger_update_participant_last_seen
    AFTER INSERT ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_participant_last_seen();

-- Create function to mark participants as offline after inactivity
CREATE OR REPLACE FUNCTION mark_inactive_participants_offline()
RETURNS void AS $$
BEGIN
    UPDATE chat_participants 
    SET is_online = FALSE
    WHERE last_seen < NOW() - INTERVAL '5 minutes' AND is_online = TRUE;
END;
$$ LANGUAGE plpgsql;
