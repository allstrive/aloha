FROM python:3.12-slim-bookworm

WORKDIR /app

# Install system dependencies for potential future AI/CV libs
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Expose port
EXPOSE 8000

# Default command (overridden by Makefile usually, but good fallback)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
