#!/bin/bash
git add "Client.zip"
git add "ClientVersion.txt"
git commit -m "Updated to %1"
git add "DeployHistory.txt"
git commit -m "Deploy history changed"
git add -A
git commit -m "Updated to %2"
git push
