# Mac Terminal Steps

It looks like you accidentally pasted the incident JSON code directly into your terminal prompt, which is why it looked like broken code. 

To get everything working, you just need to be in the right folder. You have two different folders on your Mac:
1. **`coreintent`** (This is where the new code and the new ZynRip v3 script live)
2. **`zynthio-tools`** (This is where you were getting the `ZYN_RIP_SRC` errors)

Here are the exact commands to copy and paste into your terminal, one by one.

### 1. Pull the new code
Copy and paste this block to go to the right folder and pull the updates:

```bash
cd ~/Desktop/coreintent
git fetch origin
git checkout claude/check-coreintent-builds-JTrDd
git pull origin claude/check-coreintent-builds-JTrDd
```

### 2. Run the new ZynRip (v3)
The newly fixed ZynRip script that works on Mac is inside the `coreintent` folder. 

Copy and paste this to run a dry-run:

```bash
cd ~/Desktop/coreintent
bash scripts/zynrip-organize.sh
```

### 3. Apply ZynRip
If the dry-run output looks correct, copy and paste this to actually move the files and generate the MAP:

```bash
cd ~/Desktop/coreintent
bash scripts/zynrip-organize.sh --apply --yes
```