#!/bin/bash

CON_NAME="pibo-wifi"  # 고정된 연결 이름

if ! command -v nmcli &> /dev/null; then
  echo "Error: nmcli command not found. Ensure NetworkManager is installed."
  exit 1
fi

# 오픈 네트워크 연결
create_open_connection() {
  local SSID="$1"

  echo "Deleting existing connection: $CON_NAME (if it exists)"
  sudo nmcli connection del "$CON_NAME" 2>/dev/null

  echo "Adding open network connection: SSID='$SSID'"
  sudo nmcli connection add type wifi con-name "$CON_NAME" ifname wlan0 ssid "$SSID" \
    802-11-wireless-security.key-mgmt none \
    connection.autoconnect yes ipv4.method auto ipv6.method auto

  # Open network 연결 강제 활성화
  echo "Activating open network connection: SSID='$SSID'"
  sudo nmcli device wifi connect "$SSID" ifname wlan0 || return 1
  return 0
}

# WPA-PSK 네트워크 연결
create_wpa_connection() {
  local SSID="$1"
  local PSK="$2"

  echo "Deleting existing connection: $CON_NAME (if it exists)"
  sudo nmcli connection del "$CON_NAME" 2>/dev/null

  echo "Adding WPA-PSK network connection: SSID='$SSID'"
  sudo nmcli connection add type wifi con-name "$CON_NAME" ifname wlan0 ssid "$SSID" \
    wifi-sec.key-mgmt wpa-psk wifi-sec.psk "$PSK" \
    connection.autoconnect yes ipv4.method auto ipv6.method auto
  return $?
}

# WPA-Enterprise 네트워크 연결
create_wpa_e_connection() {
  local SSID="$1"
  local IDENTITY="$2"
  local PASSWORD="$3"

  echo "Deleting existing connection: $CON_NAME (if it exists)"
  sudo nmcli connection del "$CON_NAME" 2>/dev/null

  echo "Adding WPA-Enterprise network connection: SSID='$SSID'"
  sudo nmcli connection add type wifi con-name "$CON_NAME" ifname wlan0 ssid "$SSID" \
    wifi-sec.key-mgmt wpa-eap \
    802-1x.eap peap \
    802-1x.phase2-auth mschapv2 \
    802-1x.identity "$IDENTITY" \
    802-1x.password "$PASSWORD" \
    connection.autoconnect yes ipv4.method auto ipv6.method auto
  return $?
}

# 연결 활성화
activate_connection() {
  echo "Activating connection: $CON_NAME"
  sudo nmcli connection up "$CON_NAME"
  return $?
}

# 명령어 처리
case $1 in
  open)
    if [ $# -ne 2 ]; then
      echo "Usage: sudo $0 open <SSID>"
      exit 1
    fi
    SSID="$2"
    echo "Connecting to an open network: SSID='$SSID'"
    create_open_connection "$SSID"
    if [ $? -ne 0 ]; then
      echo "Error: Failed to activate open network connection."
      exit 1
    fi
    echo "Successfully connected to open network: SSID='$SSID'"
    ;;

  wpa-psk)
    if [ $# -ne 3 ]; then
      echo "Usage: sudo $0 wpa <SSID> <PSK>"
      exit 1
    fi
    SSID="$2"
    PSK="$3"
    echo "Connecting to a WPA-PSK network: SSID='$SSID'"
    create_wpa_connection "$SSID" "$PSK"
    if [ $? -ne 0 ]; then
      echo "Error: Failed to create WPA-PSK network connection."
      exit 1
    fi
    activate_connection
    if [ $? -ne 0 ]; then
      echo "Error: Failed to activate WPA-PSK network connection."
      exit 1
    fi
    echo "Successfully connected to WPA-PSK network: SSID='$SSID'"
    ;;

  wpa-enterpise)
    if [ $# -ne 4 ]; then
      echo "Usage: sudo $0 wpa-e <SSID> <IDENTITY> <PASSWORD>"
      exit 1
    fi
    SSID="$2"
    IDENTITY="$3"
    PASSWORD="$4"
    echo "Connecting to a WPA-Enterprise network: SSID='$SSID'"
    create_wpa_e_connection "$SSID" "$IDENTITY" "$PASSWORD"
    if [ $? -ne 0 ]; then
      echo "Error: Failed to create WPA-Enterprise network connection."
      exit 1
    fi
    activate_connection
    if [ $? -ne 0 ]; then
      echo "Error: Failed to activate WPA-Enterprise network connection."
      exit 1
    fi
    echo "Successfully connected to WPA-Enterprise network: SSID='$SSID'"
    ;;

  *)
    echo "Usage:"
    echo "  Open network:         sudo $0 open <SSID>"
    echo "  WPA-PSK network:      sudo $0 wpa-psk <SSID> <PSK>"
    echo "  WPA-Enterprise:       sudo $0 wpa-e <SSID> <IDENTITY> <PASSWORD>"
    exit 1
    ;;
esac

