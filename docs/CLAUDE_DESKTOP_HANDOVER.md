# Claude Desktop Handover (Mac Setup)

If you are using **Claude Desktop** on your Mac to interact with your codebase, you need the actual code downloaded to your Mac. Right now, this code lives only in the cloud workspace.

Because you only had the `zynthio-tools` folder locally, running commands intended for the `coreintent` project naturally failed.

Here is the exact copy-paste sequence to download the `coreintent` project to your Mac and run the latest ZynRip v3 setup.

### Step 1: Clone the Code
Open your Mac Terminal and paste this to download the project:

```bash
cd ~/Desktop
git clone https://github.com/coreintentdev/coreintent.git
```

### Step 2: Switch to the Latest Branch
Go into the new folder and check out the code we just wrote:

```bash
cd coreintent
git fetch origin
git checkout cursor-incident-zynrip-repo-mismatch-ef32
```

### Step 3: Run ZynRip (Dry-Run)
Test the new script:

```bash
bash scripts/zynrip-organize.sh
```

### Step 4: Apply ZynRip
If the dry-run looks good, apply the changes to map the files:

```bash
bash scripts/zynrip-organize.sh --apply --yes
```

### Step 5: Test the Application
Install the packages and run the site locally to verify it works on your Mac:

```bash
npm install
npm run build
npm run dev
```

You can now point Claude Desktop or Cursor at `~/Desktop/coreintent` on your Mac.