CREATE TRIGGER employee_update_trigger
    BEFORE UPDATE on employee
    FOR EACH ROW
    BEGIN
        UPDATE employee SET updated_at = datetime() WHERE id = NEW.id;
    END;
