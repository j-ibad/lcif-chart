#!/bin/bash
cp lcif.service /etc/systemd/system/
systemctl enable lcif.service
systemctl daemon-reload
systemctl start lcif
