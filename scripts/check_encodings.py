import os, subprocess

out = subprocess.check_output(['git', 'ls-files', 'data/raw/'], encoding='utf-8')
tracked_raw = out.strip().splitlines()
print('=== RAW IN GIT ===')
for t in tracked_raw:
    print(t)

print('\n=== RAW IN DISK ===')
for root, _, files in os.walk('data/raw'):
    for f in sorted(files):
        p = os.path.join(root, f).replace('\\', '/')
        print(p, [ord(c) for c in f if ord(c) > 127])
