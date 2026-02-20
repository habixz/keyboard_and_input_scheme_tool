import json
import os
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LAYOUTS_FILE = os.path.join(BASE_DIR, "saved_layouts.json")
LOCK = threading.Lock()


def _read_layouts():
    if not os.path.exists(LAYOUTS_FILE):
        return []
    try:
        with open(LAYOUTS_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        if isinstance(data, list):
            return data
        if isinstance(data, dict) and isinstance(data.get("entries"), list):
            return data["entries"]
    except Exception:
        return []
    return []


def _write_layouts(entries):
    tmp = LAYOUTS_FILE + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump({"format": "shuangpin-layouts", "version": 1, "entries": entries}, f, ensure_ascii=False, indent=2)
    os.replace(tmp, LAYOUTS_FILE)


def _read_json_body(handler):
    length = int(handler.headers.get("Content-Length", "0") or "0")
    if length <= 0:
        return None
    raw = handler.rfile.read(length)
    if not raw:
        return None
    try:
        return json.loads(raw.decode("utf-8"))
    except Exception:
        return None


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        return super().end_headers()

    def _send_json(self, obj, status=200):
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/layouts":
            with LOCK:
                entries = _read_layouts()
            return self._send_json({"entries": entries})
        return super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/layouts/reorder":
            payload = _read_json_body(self)
            if payload is None or not isinstance(payload, dict):
                return self._send_json({"error": "invalid_json"}, status=400)
            ids = payload.get("ids")
            if not isinstance(ids, list) or len(ids) == 0:
                return self._send_json({"error": "invalid_ids"}, status=400)
            ids = [str(x) for x in ids if str(x).strip() != ""]
            if len(ids) == 0:
                return self._send_json({"error": "invalid_ids"}, status=400)
            with LOCK:
                entries = _read_layouts()
                by_id = {}
                for e in entries:
                    if isinstance(e, dict):
                        by_id[str(e.get("id") or "")] = e
                new_entries = []
                used = set()
                for entry_id in ids:
                    if entry_id in used:
                        continue
                    used.add(entry_id)
                    if entry_id in by_id:
                        new_entries.append(by_id[entry_id])
                for e in entries:
                    if isinstance(e, dict):
                        entry_id = str(e.get("id") or "")
                        if entry_id != "" and entry_id not in used:
                            new_entries.append(e)
                _write_layouts(new_entries)
            return self._send_json({"entries": new_entries})
        if parsed.path == "/api/layouts":
            payload = _read_json_body(self)
            if payload is None or not isinstance(payload, dict):
                return self._send_json({"error": "invalid_json"}, status=400)
            entry = payload.get("entry")
            if entry is None or not isinstance(entry, dict):
                return self._send_json({"error": "missing_entry"}, status=400)
            name = str(entry.get("name") or "").strip()
            scheme = str(entry.get("scheme") or "").strip()
            if name == "" or scheme == "":
                return self._send_json({"error": "invalid_entry"}, status=400)
            entry_id = str(entry.get("id") or "")
            if entry_id == "":
                return self._send_json({"error": "missing_id"}, status=400)
            with LOCK:
                entries = _read_layouts()
                entries = [e for e in entries if str((e or {}).get("id")) != entry_id]
                entries.insert(0, entry)
                _write_layouts(entries)
            return self._send_json({"entries": entries})
        return self._send_json({"error": "not_found"}, status=404)

    def do_PUT(self):
        parsed = urlparse(self.path)
        if parsed.path.startswith("/api/layouts/"):
            entry_id = parsed.path[len("/api/layouts/") :]
            entry_id = (entry_id or "").strip()
            if entry_id == "":
                return self._send_json({"error": "missing_id"}, status=400)
            payload = _read_json_body(self)
            if payload is None or not isinstance(payload, dict):
                return self._send_json({"error": "invalid_json"}, status=400)
            if isinstance(payload.get("entry"), dict):
                entry = payload.get("entry")
                name = str(entry.get("name") or "").strip()
                scheme = str(entry.get("scheme") or "").strip()
                if name == "" or scheme == "":
                    return self._send_json({"error": "invalid_entry"}, status=400)
                if str(entry.get("id") or "") != entry_id:
                    return self._send_json({"error": "id_mismatch"}, status=400)
                with LOCK:
                    entries = _read_layouts()
                    updated = False
                    for i, e in enumerate(entries):
                        if str((e or {}).get("id")) == entry_id:
                            entries[i] = entry
                            updated = True
                            break
                    if not updated:
                        return self._send_json({"error": "not_found"}, status=404)
                    _write_layouts(entries)
                return self._send_json({"entries": entries})

            name = str(payload.get("name") or "").strip()
            if name == "":
                return self._send_json({"error": "invalid_name"}, status=400)
            with LOCK:
                entries = _read_layouts()
                updated = False
                for e in entries:
                    if str((e or {}).get("id")) == entry_id and isinstance(e, dict):
                        e["name"] = name
                        updated = True
                        break
                if not updated:
                    return self._send_json({"error": "not_found"}, status=404)
                _write_layouts(entries)
            return self._send_json({"entries": entries})
        return self._send_json({"error": "not_found"}, status=404)

    def do_DELETE(self):
        parsed = urlparse(self.path)
        if parsed.path.startswith("/api/layouts/"):
            entry_id = parsed.path[len("/api/layouts/") :]
            entry_id = (entry_id or "").strip()
            if entry_id == "":
                return self._send_json({"error": "missing_id"}, status=400)
            with LOCK:
                entries = _read_layouts()
                kept = [e for e in entries if str((e or {}).get("id")) != entry_id]
                _write_layouts(kept)
            return self._send_json({"entries": kept})
        return self._send_json({"error": "not_found"}, status=404)


def main():
    port = int(os.environ.get("PORT", "8000"))
    os.chdir(BASE_DIR)
    httpd = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print(f"Serving on http://127.0.0.1:{port}/eval.html")
    httpd.serve_forever()


if __name__ == "__main__":
    main()
