#!/usr/bin/env bash

# Terminate already running bar instances
killall -q polybar

# Wait until the processes have been shut down
while pgrep -u $UID -x polybar >/dev/null; do sleep 1; done

if type "xrandr"; then
  # Launch mybar for each monitor
  for m in $(xrandr --query | grep " connected" | cut -d" " -f1); do
    MONITOR=$m polybar --reload main &
    sleep 0.1  # Wait for the first status bar to get the system trayfor the first status bar to get the system tray
  done
else
  # Launch mybar
  polybar --reload main &
fi

echo "Bars launched..."
