# Use the official Grafana image
FROM grafana/grafana:latest

# Copy the compiled plugin and automatically set ownership to the Grafana user (UID 472, GID 0)
COPY --chown=472:0 dist /var/lib/grafana/plugins/kuremonitor-kure-app

# Tell Grafana to allow this specific unsigned plugin to load
ENV GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS="kuremonitor-kure-app"
