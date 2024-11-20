#!/bin/bash

set -euo pipefail
IFS=$'\n\t'

# 기본 설정
ETH_IFACE="eth0"
WIFI_IFACE="wlan0"
AP_IFACE="ap0"
AP_SSID="pibo-$(grep 'Serial' /proc/cpuinfo | awk '{print $3}' | rev | cut -c -8 | rev)"
AP_PASSWORD="!pibo0314"
STATIC_IP="192.168.34.1"
DHCP_RANGE_START="192.168.34.10"
DHCP_RANGE_END="192.168.34.50"
SUBNET_MASK="255.255.255.0"
CONNECTION_NAME="pibo-ap"

# 명령어 사용 안내
usage() {
  echo "Usage: $0 {start|stop|status}"
  exit 1
}

# 가상 인터페이스 생성
create_virtual_interface() {
  echo "Creating virtual interface $AP_IFACE..."
  sudo iw dev $WIFI_IFACE interface add $AP_IFACE type __ap || echo "Interface already exists"
}

# 가상 인터페이스 삭제
remove_virtual_interface() {
  echo "Removing virtual interface $AP_IFACE..."
  sudo iw dev $AP_IFACE del || echo "Interface $AP_IFACE does not exist"
}

# NAT 및 IP Forwarding 설정
enable_nat_ip_forwarding() {
  echo "Enabling NAT and IP Forwarding..."
  sudo iptables -t nat -A POSTROUTING -o "$WIFI_IFACE" -j MASQUERADE
  echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward
}

# NAT 및 IP Forwarding 설정 제거
disable_nat_ip_forwarding() {
  echo "Disabling NAT and IP Forwarding..."
  sudo iptables -t nat -D POSTROUTING -o "$WIFI_IFACE" -j MASQUERADE || true
  echo 0 | sudo tee /proc/sys/net/ipv4/ip_forward
}

# dnsmasq DHCP 설정 파일 작성
configure_dnsmasq() {
  echo "Configuring dnsmasq for DHCP..."
  sudo bash -c "cat > /etc/dnsmasq.d/$CONNECTION_NAME.conf <<EOF
interface=$AP_IFACE
dhcp-range=$DHCP_RANGE_START,$DHCP_RANGE_END,$SUBNET_MASK,24h
EOF"
  sudo systemctl restart dnsmasq
}

# dnsmasq 설정 파일 삭제
remove_dnsmasq_config() {
  echo "Removing dnsmasq configuration..."
  sudo rm -f /etc/dnsmasq.d/$CONNECTION_NAME.conf
  sudo systemctl restart dnsmasq
}

# 핫스팟 모드 시작
start_hotspot() {
  create_virtual_interface
  echo "Starting hotspot on $AP_IFACE with SSID: $AP_SSID..."
  sudo nmcli connection add type wifi ifname "$AP_IFACE" con-name "$CONNECTION_NAME" autoconnect no ssid "$AP_SSID"
  sudo nmcli connection modify "$CONNECTION_NAME" 802-11-wireless.mode ap 802-11-wireless.band bg \
      ipv4.method manual ipv4.addresses "$STATIC_IP/24" wifi-sec.key-mgmt wpa-psk wifi-sec.psk "$AP_PASSWORD"
  sudo nmcli connection up "$CONNECTION_NAME"
  
  enable_nat_ip_forwarding
  configure_dnsmasq
  sudo iw ap0 set power_save off
}

# 핫스팟 모드 중지
stop_hotspot() {
  echo "Stopping hotspot..."
  sudo nmcli connection down "$CONNECTION_NAME" || true
  sudo nmcli connection delete "$CONNECTION_NAME" || true
  disable_nat_ip_forwarding
  remove_virtual_interface
  remove_dnsmasq_config
}

# 핫스팟 상태 확인
status_hotspot() {
  if nmcli -t -f NAME,DEVICE con show --active | grep -q "$CONNECTION_NAME"; then
    echo "Hotspot is active on $AP_IFACE with SSID: $AP_SSID"
    echo "Static IP: $STATIC_IP"
  else
    echo "Hotspot is not active"
  fi
}

# 메인 명령어 처리
command=${1:-}
case "$command" in
  start)
    stop_hotspot  # 핫스팟 중복 실행 방지
    start_hotspot
    ;;
  stop)
    stop_hotspot
    ;;
  status)
    status_hotspot
    ;;
  *)
    usage
    ;;
esac

