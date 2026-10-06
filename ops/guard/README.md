# Perspective Engine Guard System

Multi-layer reasoning engine for safe execution and insight generation.

## What This Is

A guardrail system that:
1. **Executor** proposes actions
2. **Verifier** checks safety and reality
3. **Investigator** finds blind spots
4. **Custom roles** add domain-specific perspectives
5. **Site** makes it shareable
6. **Consequence engine** learns from outcomes
7. **Mesh** runs multiple instances and compares

See [PERSPECTIVE_ENGINE.md](./PERSPECTIVE_ENGINE.md) for full documentation.

## Quick Reference

### Files in This Directory

| File | Purpose |
|------|---------|
| `PERSPECTIVE_ENGINE.md` | Full system docs (Layers 1–7) |
| `roles.yaml` | Role definitions |
| `policy.yaml` | Safety policy and verification checklist |
| `consequence.yaml` | Outcome schema for Layer 6 |
| `perspective-engine.sh` | Main runner (Layers 1–5) |
| `consequence.sh` | Outcome recorder (Layer 6) |
| `mesh.sh` | Multi-instance runner (Layer 7) |

### Running It

**Basic analysis (Layers 1–5):**
```bash
./perspective-engine.sh --problem "..." --roles all --output report.md
```

**With custom roles:**
```bash
./perspective-engine.sh --problem "..." --config my-roles.yaml --output report.md
```

**Record outcome (Layer 6):**
```bash
./consequence.sh record --task-id abc123 --result success --notes "..."
```

**Run mesh (Layer 7):**
```bash
./mesh.sh run --problem "..." --instances 3 --output mesh-report.md
```

## Policy

Safety policy lives in `policy.yaml`:
- **VDS target:** 100.64.0.2 (NOT 100.121.107.112)
- **Forbidden ops:** Force push, history rewrites, rclone --delete-during
- **Verification checklist:** What to check before git push, delete, npm claim

## Examples

### Example 1: Git Push to VDS

```bash
./perspective-engine.sh \
  --problem "Push coreintent to vds:/srv/git/coreintent.git" \
  --roles executor,verifier,investigator \
  --output report.md

cat output/reports/report.md
```

**Output includes:**
- Executor's proposed commands
- Verifier's safety check (confirms VDS address, repo existence)
- Investigator's blind spot analysis (e.g., "bare repo blocks checkout")

### Example 2: With Security Analysis

```bash
./perspective-engine.sh \
  --problem "Deploy trading engine to VDS" \
  --config roles.yaml \
  --roles executor,verifier,investigator,security_auditor \
  --output report.md
```

**Output includes:**
- All previous + Security Auditor's threat analysis

### Example 3: Record Outcome, Build Reputation

```bash
# Run analysis
./perspective-engine.sh --problem "..." --output report.md

# Execute the approved action
# (something happens)

# Record what actually happened
./consequence.sh record \
  --task-id abc123 \
  --result success \
  --notes "Mirror created, push worked, but investigator was right about bare repo issue"

# View role reputation
./consequence.sh report --role verifier
```

**Output:**
```
ROLE REPUTATION (Last 30 tasks)
verifier        9/10 correct decisions (90%)
investigator    7/10 blind spots found (70%)
executor        6/10 proposals worked (60%)
```

## How to Use in Your Workflow

### For VDS Deployments

1. **Propose** with executor:
   ```bash
   ./perspective-engine.sh --problem "sync coreintent to VDS"
   ```

2. **Verify** output:
   - Check Verifier's decision (APPROVED/REJECTED)
   - Read Investigator's blind spot warnings

3. **Act** if approved:
   ```bash
   ssh vds 'git init --bare /srv/git/coreintent.git'
   git push vds main --tags
   ```

4. **Record** outcome:
   ```bash
   ./consequence.sh record --task-id abc123 --result success
   ```

### For GitHub Actions / CI

Add to `.github/workflows/deploy.yml`:
```yaml
- name: Perspective check
  run: |
    cd ops/guard
    ./perspective-engine.sh \
      --problem "Deploy to production" \
      --roles all \
      --output /tmp/perspective-report.md
    cat /tmp/perspective-report.md
```

### For Code Reviews

Use perspective reports in PR comments:
```markdown
### Perspective Analysis

[Paste the perspective-engine output here]

**Verifier Decision:** APPROVED
**Investigator Notes:** Watch for bare repo checkout issues
```

## Extending with Custom Roles

### Add a Custom Role

Edit `roles.yaml`:
```yaml
my_role:
  name: "My Custom Role"
  description: "What this analyzes"
  system_prompt: |
    You are My Custom Role.
    Read all previous outputs.
    Ask yourself:
    - My question 1
    - My question 2
    - My question 3
  input_from: ["executor", "verifier", "investigator"]
  output_format: "assessment"
  is_user_definable: true
```

Then run:
```bash
./perspective-engine.sh --problem "..." --roles all --output report.md
```

## VDS Integration

On your VDS (100.64.0.2):

```bash
# Clone this guard system to VDS
scp -r ops/guard vds:/opt/coreintent-guard/

# Use it on VDS
ssh vds '/opt/coreintent-guard/perspective-engine.sh --problem "..." --output /tmp/report.md'
```

## Consequence Engine (Layer 6)

After running tasks, record outcomes to build role reputation:

```bash
./consequence.sh record \
  --task-id abc123 \
  --result success \
  --notes "completed successfully"

./consequence.sh report --role verifier
./consequence.sh report --role investigator
./consequence.sh report --task-type "git_operations"
```

## Mesh (Layer 7)

Run same task through multiple model instances, see where they agree/disagree:

```bash
./mesh.sh run \
  --problem "Push to VDS" \
  --instances 3 \
  --models "claude,grok,local-llama" \
  --output mesh-report.md

cat output/reports/mesh-report.md
```

**Output shows:**
- CONSENSUS: all instances agree
- DISSENT: only 1 instance said X
- META-BLIND-SPOT: all instances missed Y

## FAQ

**Q: Why does the Verifier check against policy.yaml?**  
A: Because documentation lies. Policy.yaml is truth about your actual infrastructure.

**Q: Why record outcomes (Layer 6)?**  
A: So roles improve over time. If Verifier is 90% accurate, trust it more.

**Q: Why run a mesh (Layer 7)?**  
A: Single instances can hallucinate. Multiple instances reveal where they agree/disagree.

**Q: Can I use this without the site (Layer 5)?**  
A: Yes. Run locally. The site is optional for sharing.

**Q: Is this production-ready?**  
A: It's working and tested. Use it. Record outcomes. Let it improve.

## Links

- [Full Documentation](./PERSPECTIVE_ENGINE.md)
- [Policy Reference](./policy.yaml)
- [Consequence Schema](./consequence.yaml)
- [Role Definitions](./roles.yaml)

## Author

Corey McIvor (@coreintentdev)  
Built as part of CoreIntent/Zynthio platform.
