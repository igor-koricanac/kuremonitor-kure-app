#!/usr/bin/env bash

# Create local cluster
kind create cluster --name test-kure

# Add the Helm repository
helm repo add kure-monitor https://igor-koricanac.github.io/kure-monitor/
helm repo update

# Install Kure Monitor
helm install kure-monitor kure-monitor/kure \
  --namespace kure-system \
  --create-namespace \
  --set postgresql.password="$(openssl rand -hex 24)"

npm run build

# Build docker image
docker build --no-cache -t custom-grafana:1.0.0 .

# Load image to the cluster
kind load docker-image custom-grafana:1.0.0 --name test-kure

# Spin up Grafana with kure plugin
kubectl apply -f ./setup_grafana.yaml
