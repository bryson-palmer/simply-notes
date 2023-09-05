import sqlite3
from constants import DB_FILE

def create_update_tables():
    """ create tables if not yet created, and add any updates required """
    connection = sqlite3.connect(DB_FILE)
    cursor = connection.cursor()
    create_notes_table = """
    CREATE TABLE IF NOT EXISTS NOTES(id, title, body, user_id, folder_id)
    """

    create_folders_table = """
    CREATE TABLE IF NOT EXISTS FOLDERS(id, folderName, user_id)
    """
    create_user_table = """
    CREATE TABLE IF NOT EXISTS USERS(id, username, email, password, registered, last_login)
    """
    cursor.execute(create_notes_table)
    cursor.execute(create_folders_table)
    cursor.execute(create_user_table)
    connection.commit()

    # adding folder_id to NOTES existing NOTES table
    # warning: pragma_table_info may be SQLite specific
    cursor.execute("SELECT COUNT(*) FROM pragma_table_info('NOTES') WHERE name='folder_id'")
    result = cursor.fetchone()
    has_folder = result[0]  # will return 0 or 1+
    print(has_folder)
    if not has_folder:
        add_folder_to_notes_table = """
            ALTER TABLE NOTES ADD COLUMN folder_id
        """
        cursor.execute(add_folder_to_notes_table)
        # cursor.execute(f'PRAGMA user_version = {version + 1}')
        connection.commit()
    cursor.execute("SELECT COUNT(*) FROM pragma_table_info('FOLDERS') WHERE name='user_id'")
    result = cursor.fetchone()
    has_user = result[0]  # will return 0 or 1+
    if not has_user:
        add_user_to_folders_table = """
            ALTER TABLE FOLDERS ADD COLUMN user_id
        """
        cursor.execute(add_user_to_folders_table)
        # cursor.execute(f'PRAGMA user_version = {version + 1}')
        connection.commit()

     # add last_modified to folders and notes tables
    cursor.execute("SELECT COUNT(*) FROM pragma_table_info('NOTES') WHERE name='last_modified'")
    result = cursor.fetchone()
    has_last_modified = result[0]  # will return 0 or 1+
    if not has_last_modified:
        cursor.execute(
            """
                ALTER TABLE NOTES ADD COLUMN
                last_modified TEXT
            """
        )
        connection.commit()
        cursor.execute(
            """
                ALTER TABLE FOLDERS ADD COLUMN
                last_modified TEXT
            """
        )
        connection.commit()


    # re-drop triggers each time so they get re-created below
    cursor.execute('DROP TRIGGER IF EXISTS update_NOTES_last_modified')
    cursor.execute('DROP TRIGGER IF EXISTS insert_NOTES_last_modified')
    connection.commit()
   
    # now add date-triggers for update/insert of notes and folders
    notes_update_trigger_last_modified = '''
        CREATE TRIGGER update_NOTES_last_modified
                AFTER UPDATE
                    ON NOTES
        BEGIN
            UPDATE NOTES
            SET last_modified = strftime('%Y-%m-%d %H:%M:%S:%s', 'now', 'localtime') 
            WHERE id = OLD.id and user_id = OLD.user_id and folder_id = OLD.folder_id;
        END;
    '''
    notes_insert_trigger_last_modified = '''
        CREATE TRIGGER insert_NOTES_last_modified
                AFTER INSERT
                    ON NOTES
        BEGIN
            UPDATE NOTES
            SET last_modified = strftime('%Y-%m-%d %H:%M:%S:%s', 'now', 'localtime') 
            WHERE id = NEW.id and user_id = NEW.user_id and folder_id = NEW.folder_id;
        END;
    '''

    cursor.execute(notes_update_trigger_last_modified)
    cursor.execute(notes_insert_trigger_last_modified)
    connection.commit()
    connection.close()
