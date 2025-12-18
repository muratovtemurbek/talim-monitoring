FROM python:3.11-slim

# Cache bust v3 - Full stack deployment
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV NODE_ENV=production

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

# Copy frontend first and build
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm ci --only=production=false

# Copy frontend source and build
COPY frontend/ ./
RUN npm run build

# Back to main directory
WORKDIR /app

# Copy backend
COPY . .

# Collect static files (Django + React)
RUN python manage.py collectstatic --noinput --clear

# Create media directory
RUN mkdir -p /app/media

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8000}/api-info/ || exit 1

# Run the application with migrations
CMD ["sh", "-c", "python manage.py migrate --noinput && gunicorn edu_monitoring.wsgi --bind 0.0.0.0:${PORT:-8000} --workers 2 --threads 4 --worker-class gthread --timeout 120"]
