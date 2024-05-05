'''
Test for django wait_for_db commands.
'''
from unittest.mock import patch
'''
unittest.mock is likely used to create mock objects for 
the functions or methods that are being tested, 
or for their dependencies. This allows the tests 
to focus on the behavior of the functions or methods under test, 
without worrying about the actual implementation of their dependencies.
'''
from django.test import SimpleTestCase #  a subclass of TestCase that does not require a database. cuz use mock to simulate the database.
from django.core.management import call_command #  allows to call Django management commands programmatically. This is useful for testing management commands.

# Error 
from django.db.utils import OperationalError #  raised when the database is unavailable.
from psycopg2 import OperationalError as Psycopg2OperationalError #  raised when the database is unavailable.


@patch('time_tracker.management.commands.wait_for_db.Command.check') # Isolates the test from the actual database.
class CommandTests(SimpleTestCase):
    """Test commands."""

    def test_wait_for_db_ready(self, patched_check):
        """Test waiting for database if database ready."""
        # Setup the patched check to return True.
        patched_check.return_value = True
        # Test1. check if the command can be call inside django proj.
        call_command('wait_for_db')
        # Test2. check if the command is called with the right args.
        patched_check.assert_called_once_with(databases=['default'])

    # @patch('time.sleep')
    def test_wait_for_db_delay(self, patched_check):
        """Test waiting for database if database not ready (OperationalError)."""
        patched_check.side_effect = [Psycopg2OperationalError] * 2 + \
            [OperationalError] * 3 + [True]

        call_command('wait_for_db')

        self.assertEqual(patched_check.call_count, 6)
        patched_check.assert_called_with(databases=['default'])