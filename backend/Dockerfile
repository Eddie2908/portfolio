FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run as a non-root user for security
RUN useradd --create-home --uid 1000 appuser \
    && mkdir -p /app/static/uploads \
    && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD python -c "import os,urllib.request,sys; \
        port=os.environ.get('PORT','8000'); \
        sys.exit(0) if urllib.request.urlopen(f'http://127.0.0.1:{port}/health', timeout=4).status==200 else sys.exit(1)"

CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
