class DVDBouncer {
    constructor() {
        this.logo = document.getElementById('bouncing-logo');
        this.bounceArea = document.getElementById('bounce-area');
        this.cornerHitsElement = document.getElementById('corner-hits');
        this.resetBtn = document.getElementById('reset-btn');
        this.speedBtn = document.getElementById('speed-btn');
        
        // 初期設定
        this.x = Math.random() * (window.innerWidth - 120);
        this.y = Math.random() * (window.innerHeight - 120);
        this.dx = 2; // X方向の速度
        this.dy = 2; // Y方向の速度
        this.cornerHits = 0;
        this.speedMultiplier = 1;
        this.isGaming = false;
        
        // 色の配列（DVDロゴ風）
        this.colors = [
            '#ff0000', '#ff8000', '#ffff00', '#80ff00',
            '#00ff00', '#00ff80', '#00ffff', '#0080ff',
            '#0000ff', '#8000ff', '#ff00ff', '#ff0080'
        ];
        this.currentColorIndex = 0;
        
        this.init();
    }
    
    init() {
        this.logo.style.left = this.x + 'px';
        this.logo.style.top = this.y + 'px';
        this.updateCornerHits();
        this.bindEvents();
        this.startAnimation();
    }
    
    bindEvents() {
        this.resetBtn.addEventListener('click', () => this.reset());
        this.speedBtn.addEventListener('click', () => this.changeSpeed());
        
        // ウィンドウリサイズ対応
        window.addEventListener('resize', () => {
            this.adjustPositionOnResize();
        });
    }
    
    startAnimation() {
        this.animate();
    }
    
    animate() {
        this.move();
        requestAnimationFrame(() => this.animate());
    }
    
    move() {
        // 新しい位置を計算
        this.x += this.dx * this.speedMultiplier;
        this.y += this.dy * this.speedMultiplier;
        
        // 境界との衝突判定
        const logoRect = this.logo.getBoundingClientRect();
        const containerRect = this.bounceArea.getBoundingClientRect();
        
        const logoWidth = logoRect.width;
        const logoHeight = logoRect.height;
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        
        let hitCorner = false;
        
        // 左右の壁との衝突
        if (this.x <= 0) {
            this.x = 0;
            this.dx = -this.dx;
            this.changeColor();
            
            // 左上角または左下角の判定
            if (this.y <= 5 || this.y >= containerHeight - logoHeight - 5) {
                hitCorner = true;
            }
        } else if (this.x >= containerWidth - logoWidth) {
            this.x = containerWidth - logoWidth;
            this.dx = -this.dx;
            this.changeColor();
            
            // 右上角または右下角の判定
            if (this.y <= 5 || this.y >= containerHeight - logoHeight - 5) {
                hitCorner = true;
            }
        }
        
        // 上下の壁との衝突
        if (this.y <= 0) {
            this.y = 0;
            this.dy = -this.dy;
            this.changeColor();
            
            // 左上角または右上角の判定
            if (this.x <= 5 || this.x >= containerWidth - logoWidth - 5) {
                hitCorner = true;
            }
        } else if (this.y >= containerHeight - logoHeight) {
            this.y = containerHeight - logoHeight;
            this.dy = -this.dy;
            this.changeColor();
            
            // 左下角または右下角の判定
            if (this.x <= 5 || this.x >= containerWidth - logoWidth - 5) {
                hitCorner = true;
            }
        }
        
        // 四隅に当たった場合の処理
        if (hitCorner) {
            this.handleCornerHit();
        }
        
        // 位置を更新
        this.logo.style.left = this.x + 'px';
        this.logo.style.top = this.y + 'px';
    }
    
    handleCornerHit() {
        if (!this.isGaming) {
            this.cornerHits++;
            this.updateCornerHits();
            this.triggerGamingEffect();
            
            // 効果音を鳴らす（Web Audio API）
            this.playCornerHitSound();
        }
    }
    
    triggerGamingEffect() {
        this.isGaming = true;
        
        // ロゴにゲーミング発光エフェクトを追加
        this.logo.classList.add('gaming-glow');
        
        // 背景にレインボーエフェクトを追加
        this.bounceArea.classList.add('rainbow-bg');
        
        // 一定時間後にエフェクトを解除
        setTimeout(() => {
            this.logo.classList.remove('gaming-glow');
            this.bounceArea.classList.remove('rainbow-bg');
            this.isGaming = false;
        }, 1000);
    }
    
    playCornerHitSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // 派手な効果音
            oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.1);
            oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.type = 'square';
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            console.log('オーディオ再生エラー:', error);
        }
    }
    
    changeColor() {
        this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
        this.logo.style.filter = `hue-rotate(${this.currentColorIndex * 30}deg) drop-shadow(0 0 10px ${this.colors[this.currentColorIndex]})`;
    }
    
    updateCornerHits() {
        this.cornerHitsElement.textContent = this.cornerHits;
    }
    
    reset() {
        this.x = Math.random() * (window.innerWidth - 120);
        this.y = Math.random() * (window.innerHeight - 120);
        this.dx = (Math.random() > 0.5 ? 1 : -1) * 2;
        this.dy = (Math.random() > 0.5 ? 1 : -1) * 2;
        this.cornerHits = 0;
        this.currentColorIndex = 0;
        this.speedMultiplier = 1;
        this.updateCornerHits();
        this.logo.style.filter = 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))';
        this.logo.classList.remove('gaming-glow');
        this.bounceArea.classList.remove('rainbow-bg');
        this.isGaming = false;
    }
    
    changeSpeed() {
        const speeds = [0.5, 1, 1.5, 2, 3, 4, 5];
        const currentIndex = speeds.indexOf(this.speedMultiplier);
        const nextIndex = (currentIndex + 1) % speeds.length;
        this.speedMultiplier = speeds[nextIndex];
        
        // ボタンのテキストを更新
        this.speedBtn.textContent = `スピード: ${this.speedMultiplier}x`;
    }
    
    adjustPositionOnResize() {
        const containerRect = this.bounceArea.getBoundingClientRect();
        const logoRect = this.logo.getBoundingClientRect();
        
        // 画面外に出ないように調整
        if (this.x + logoRect.width > containerRect.width) {
            this.x = containerRect.width - logoRect.width;
        }
        if (this.y + logoRect.height > containerRect.height) {
            this.y = containerRect.height - logoRect.height;
        }
        
        this.logo.style.left = this.x + 'px';
        this.logo.style.top = this.y + 'px';
    }
}

// キーボードショートカット
document.addEventListener('keydown', function(event) {
    switch(event.code) {
        case 'Space':
            event.preventDefault();
            bouncer.reset();
            break;
        case 'ArrowUp':
            event.preventDefault();
            bouncer.changeSpeed();
            break;
        case 'KeyR':
            event.preventDefault();
            bouncer.reset();
            break;
    }
});

// ページ読み込み完了時に初期化
let bouncer;
document.addEventListener('DOMContentLoaded', function() {
    bouncer = new DVDBouncer();
});

// タッチ対応（モバイル）
document.addEventListener('touchstart', function(event) {
    if (event.touches.length === 2) {
        // 2本指タッチでリセット
        bouncer.reset();
    }
});

// フルスクリーン対応
document.addEventListener('dblclick', function() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen();
    }
}); 