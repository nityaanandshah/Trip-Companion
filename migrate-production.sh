#!/bin/bash

# Migrate Production Database Script
# This script will run Prisma migrations on your production Supabase database

echo "🚀 Starting Production Database Migration..."
echo ""
echo "⚠️  IMPORTANT: Make sure you've replaced YOUR-PASSWORD in the DATABASE_URL below!"
echo ""

# Prompt for production database URL
read -p "Enter your production DATABASE_URL (from Supabase): " PROD_DB_URL

# Validate input
if [ -z "$PROD_DB_URL" ]; then
    echo "❌ Error: DATABASE_URL cannot be empty"
    exit 1
fi

echo ""
echo "📋 Running migrations..."
echo ""

# Run Prisma migrations
DATABASE_URL="$PROD_DB_URL" npx prisma migrate deploy

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Production database migrations completed successfully!"
    echo ""
    echo "📊 Generating Prisma Client for production..."
    DATABASE_URL="$PROD_DB_URL" npx prisma generate
    echo ""
    echo "✨ All done! Your production database is ready."
    echo ""
    echo "Next steps:"
    echo "1. Go to Vercel and import your GitHub repository"
    echo "2. Add the DATABASE_URL environment variable"
    echo "3. Deploy!"
else
    echo ""
    echo "❌ Migration failed. Please check the error above."
    exit 1
fi


