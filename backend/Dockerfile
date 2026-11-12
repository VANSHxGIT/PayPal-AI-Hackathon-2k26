# ==============================================================================
# Evidentia — Hardened Production Dockerfile
# ==============================================================================

FROM python:3.11-slim

# Set environment flags
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    ENVIRONMENT=production \
    DEBUG=false \
    PORT=8000

WORKDIR /app

# Install system dependencies (build tools for cryptographic extensions)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libffi-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create non-root user for security (Least Privilege Principle)
RUN useradd -m -u 1000 Evidentia && \
    mkdir -p /app/backups && \
    chown -R Evidentia:Evidentia /app

# Copy application source
COPY --chown=Evidentia:Evidentia . .

# Switch to non-root user
USER Evidentia

EXPOSE 8000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

