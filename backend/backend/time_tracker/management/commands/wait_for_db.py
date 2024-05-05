"""
Django command to wait for the database to be available.
"""
from django.core.management.base import BaseCommand
from django.db.utils import OperationalError

import time
from psycopg2 import OperationalError as Psycopg2OpError



class Command(BaseCommand):
    """Django command to wait for database."""

    # The Command class should define a handle method, which is the entry point for your command.
    def handle(self, *args, **options):
        """Entrypoint for command."""
        
        # The self.stdout.write() method writes a message to the console.
        self.stdout.write('Waiting for database...') # The self.stdout.write() method writes a message to the console.
        db_up = False
        while db_up is False:
            try:
                self.check(databases=['default'])
                db_up = True
            except (Psycopg2OpError, OperationalError):
                self.stdout.write('Database unavailable, waiting 1 second...')
                time.sleep(1)

        self.stdout.write(self.style.SUCCESS('Database available!'))