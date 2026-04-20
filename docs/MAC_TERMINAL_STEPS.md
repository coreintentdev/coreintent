# Mac Terminal Steps

Ah, looking at your Desktop, you don't have the `coreintent` folder cloned locally yet! Since you are working in a Cursor Cloud Workspace, the code lives in the cloud, not on your Mac.

Because the repository is private, you need to clone it to your Mac to run the new script.

Here are the exact commands to copy and paste into your local Mac terminal:

### 1. Clone the repo to your Desktop
```bash
cd ~/Desktop
git clone https://github.com/coreintentdev/coreintent.git
```

### 2. Go into the folder and get the right branch
```bash
cd coreintent
git fetch origin
git checkout claude/check-coreintent-builds-JTrDd
```

### 3. Run the new ZynRip (v3)
Copy and paste this to run a dry-run:
```bash
bash scripts/zynrip-organize.sh
```

### 4. Apply ZynRip
If the dry-run output looks correct, copy and paste this to actually move the files and generate the MAP:
```bash
bash scripts/zynrip-organize.sh --apply --yes
```