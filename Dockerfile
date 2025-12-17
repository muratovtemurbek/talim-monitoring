FROM python:3.11-slim

# Cache bust v2 - Frontend build included
# Environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies (Python + Node.js 20)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Build React frontend
WORKDIR /app/frontend
RUN npm install && npm run build

# Back to main directory
WORKDIR /app

# Collect static files (Django + React)
RUN python manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Run the application
CMD ["sh", "-c", "python manage.py migrate && gunicorn edu_monitoring.wsgi --bind 0.0.0.0:${PORT:-8000}"]
