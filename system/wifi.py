import subprocess

def scan_with_nmcli():
    cmd = ["nmcli", "-f", "SSID,SECURITY,SIGNAL", "dev", "wifi"]
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    output, error = proc.communicate()
    if error:
        print(f"Error: {error.decode('utf-8')}")
        return []
    return output.decode("utf-8").splitlines()

def parse_nmcli_output(lines):
    networks = []
    for line in lines[1:]:  # Skip the first line, which is the header
        columns = line.split()
        
        if len(columns) == 0:
          continue

        ssid = columns[0]
        # Filter out hidden networks (SSID is empty or '--')
        if ssid == "" or ssid == "--":
            continue

        security = " ".join(columns[1:-1])  # SECURITY can have multiple words
        signal = columns[-1]
        encryption = "unknown"

        # Determine encryption type
        if "WPA2" in security:
            if "802.1X" in security:
                encryption = "wpa-eap"
            else:
                encryption = "wpa-psk"
        elif "WPA" in security:
            encryption = "wpa-psk"
        elif "WEP" in security:
            continue
        else:
            encryption = "none"

        networks.append({
            "essid": ssid,
            "signal_quality": signal,
            "encryption": encryption
        })
    return networks

def wifi_scan():
    output_lines = scan_with_nmcli()
    return parse_nmcli_output(output_lines)

if __name__ == "__main__":
    print(wifi_scan())

