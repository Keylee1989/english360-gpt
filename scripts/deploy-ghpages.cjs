/**
 * Deploy dist/ to gh-pages branch.
 * Reads token from ~/.git-credentials (never logs it).
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

function tokenFromCredentials() {
  const credPath = path.join(os.homedir(), ".git-credentials");
  if (!fs.existsSync(credPath)) return null;
  const content = fs.readFileSync(credPath, "utf8");
  const m = content.match(/https:\/\/([^:@]+):([^@\s]+)@github\.com/i);
  return m ? decodeURIComponent(m[2]) : null;
}

const REPO = "Keylee1989/english360-gpt";
const token = tokenFromCredentials();
if (!token) {
  console.error("ERROR: no github token found in ~/.git-credentials");
  process.exit(1);
}

const tmp = path.join(os.tmpdir(), "ghpages-deploy-" + Date.now());
fs.mkdirSync(tmp, { recursive: true });

function run(cmd) {
  console.log("> " + cmd.split(" ")[0] + " ...");
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      execSync(cmd, { stdio: ["ignore", "ignore", "pipe"], cwd: tmp });
      return;
    } catch (e) {
      const msg = String(e.stderr || e.message || "");
      console.log(`  attempt ${attempt} failed: ${msg.slice(0, 120).replace(token, "***")}`);
      if (attempt < 5) {
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 8000);
      } else {
        throw e;
      }
    }
  }
}

run(`git clone --depth 1 --branch gh-pages https://x-access-token:${token}@github.com/${REPO}.git .`);

// wipe everything except .git
for (const f of fs.readdirSync(tmp)) {
  if (f === ".git") continue;
  fs.rmSync(path.join(tmp, f), { recursive: true, force: true });
}

// copy dist contents
const dist = path.resolve(__dirname, "..", "dist");
fs.copyFileSync(path.join(dist, "index.html"), path.join(tmp, "index.html"));
fs.copyFileSync(path.join(dist, "sw.js"), path.join(tmp, "sw.js"));
for (const entry of fs.readdirSync(dist)) {
  if (entry === "index.html" || entry === "sw.js") continue;
  const src = path.join(dist, entry);
  const dst = path.join(tmp, entry);
  if (fs.statSync(src).isDirectory()) {
    fs.cpSync(src, dst, { recursive: true });
  } else {
    fs.copyFileSync(src, dst);
  }
}
// ensure .nojekyll so GitHub Pages serves all files as-is
fs.writeFileSync(path.join(tmp, ".nojekyll"), "");

run(`git add -A`);
try {
  run(`git -c user.name="deploy-bot" -c user.email="deploy@local" commit -m "Deploy build ${new Date().toISOString()} — grammar 551 + completion wiring"`);
} catch (e) {
  console.log("Nothing to commit.");
}
run(`git push origin gh-pages`);
console.log("DEPLOY_DONE");
