const commands = [
    {
        name: "serve",
        description: "启动 Ollama 服务",
        usage: "ollama serve"
    },
    {
        name: "create",
        description: "从 Modelfile 创建模型",
        usage: "ollama create [model-name]"
    },
    {
        name: "show",
        description: "显示模型信息",
        usage: "ollama show [model-name]"
    },
    {
        name: "run",
        description: "运行模型",
        usage: "ollama run [model-name]"
    },
    {
        name: "stop",
        description: "停止运行中的模型",
        usage: "ollama stop [model-name]"
    },
    {
        name: "pull",
        description: "从注册表拉取模型",
        usage: "ollama pull [model-name]"
    },
    {
        name: "push",
        description: "将模型推送到注册表",
        usage: "ollama push [model-name]"
    },
    {
        name: "list",
        description: "列出所有模型",
        usage: "ollama list"
    },
    {
        name: "ps",
        description: "列出运行中的模型",
        usage: "ollama ps"
    },
    {
        name: "cp",
        description: "复制模型",
        usage: "ollama cp [source-model] [target-model]"
    },
    {
        name: "rm",
        description: "删除模型",
        usage: "ollama rm [model-name]"
    }
];

function createCommandCard(command, modelName) {
    let usage = command.usage;
    if (modelName) {
        usage = usage.replace(/ \[model-name\]/g, ` ${modelName}`).replace(/\[model-name\]/g, modelName);
    }
    return `
        <div class="command-card">
            <div class="command-name">${command.name}</div>
            <div class="command-description">${command.description}</div>
            <div class="command-usage">
                ${usage}
                <button class="copy-button" onclick="copyCommand('${usage}')">
                    <svg viewBox="0 0 24 24">
                        <path d="M16 1H4C2.9 1 2 1.9 2 3v14h2V3h12V1zm3 4H8C6.9 5 6 5.9 6 7v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                    </svg>
                    复制
                </button>
            </div>
        </div>
    `;
}

function showToast(message) {
    let toast = document.querySelector('.copy-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'copy-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

function copyCommand(command) {
    navigator.clipboard.writeText(command).then(() => {
        const buttons = document.querySelectorAll('.copy-button');
        buttons.forEach(button => {
            if (button.parentElement.textContent.trim().includes(command)) {
                const originalContent = button.innerHTML;
                button.innerHTML = `
                    <svg viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                    已复制
                `;
                button.classList.add('copied');
                showToast('命令已复制到剪贴板');
                setTimeout(() => {
                    button.innerHTML = originalContent;
                    button.classList.remove('copied');
                }, 2000);
            }
        });
    }).catch(err => {
        console.error('复制失败:', err);
        showToast('复制失败，请手动复制');
    });
}

function copyModelCommand() {
    const modelName = document.getElementById('modelInput').value.trim();
    if (!modelName) {
        showToast('请输入模型名称');
        return;
    }
    
    const command = `ollama run ${modelName}`;
    navigator.clipboard.writeText(command).then(() => {
        showToast('命令已复制到剪贴板');
    }).catch(err => {
        console.error('复制失败:', err);
        showToast('复制失败，请手动复制');
    });
}

function filterCommands(searchTerm) {
    return commands.filter(command => 
        command.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        command.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

function updateCommandsGrid(searchTerm = '') {
    const modelNameInput = document.getElementById('modelInput');
    const modelName = modelNameInput ? modelNameInput.value.trim() : '';
    const filteredCommands = filterCommands(searchTerm);
    const commandsGrid = document.getElementById('commandsGrid');
    
    if (filteredCommands.length === 0) {
        commandsGrid.innerHTML = '<div class="no-results">没有找到匹配的命令</div>';
        return;
    }

    commandsGrid.innerHTML = filteredCommands
        .map(command => createCommandCard(command, modelName))
        .join('');
}

// 初始化显示所有命令
document.addEventListener('DOMContentLoaded', () => {
    updateCommandsGrid();

    // 添加搜索功能
    document.getElementById('searchInput').addEventListener('input', (e) => {
        updateCommandsGrid(e.target.value);
    });

    // 添加模型名称输入功能
    document.getElementById('modelInput').addEventListener('input', () => {
        updateCommandsGrid(document.getElementById('searchInput').value);
    });

    // 主题切换功能
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.body.classList.add(currentTheme);
    } else {
        document.body.classList.add('light-mode'); // Default to light mode
    }

    themeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('light-mode')) {
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light-mode');
        }
    });
});