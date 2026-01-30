FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY src/ ./src/

# Set Python path to include src directory
ENV PYTHONPATH=/app/src

# Expose port
EXPOSE 8081

# Run with gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8081", "--workers", "4", "--timeout", "120", "src.main:app"]
