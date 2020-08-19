const exec = require('child_process').execSync;
let tags = exec('git tag').toString('utf8').trim().split('\n');
let len = tags.length;
tags = tags.slice(len <= 2 ? 0 : len - 2);
if (tags.length === 2) {
    let commits = exec(`git log --pretty=format:"%s" ${tags[0]}...${tags[1]}`).toString('utf8').trim().split('\n');
    let msg = '';
    commits.forEach(line => {
        if (line.startsWith('[dev]') || line.startsWith('[bugfix]')) {
            msg += `${line}\n`;
        }
    });
    msg = msg.trim();
    try {
        let iconv = require('iconv-lite');
        require('child_process').spawn('clip').stdin.end(iconv.encode(msg, 'gbk'));
        console.log('clip finish');
    } catch (error) {
        console.log(`如需自动复制到粘贴板，请安装 iconv-lite。\n${msg}`);
    }
}