FROM python:3.10-slim

# Install system dependencies required by OpenCV and PaddleOCR
RUN apt-get update && apt-get install -y \
    libgl1 \
    libgomp1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Start the FastAPI app. 
# Render dynamically sets the PORT environment variable.
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-3001}

