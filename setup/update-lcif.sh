#!/bin/bash
cd lcif
git stash && git stash clear
git fetch origin && git pull origin main && npm install -y && npm run build && systemctl restart lcif