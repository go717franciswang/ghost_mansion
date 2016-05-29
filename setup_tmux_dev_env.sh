#!/bin/bash

tmux new-session -d -s gamedev 
tmux rename-window "src"
tmux send-keys -t gamedev:0 "vi src/map1.ts" C-m
tmux split-window -v -t 0 -l 10 
tmux send-keys -t gamedev:0 "cd src" C-m
tmux split-window -h -t 1 
tmux send-keys -t gamedev:0 "git status" C-m

tmux new-window -t gamedev
tmux rename-window "server"
tmux send-keys -t gamedev:1 "bash run.sh" C-m

tmux select-window -t gamedev:0
tmux select-pane -t 0

tmux -2 attach-session -t gamedev

