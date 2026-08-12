function setTheme(themeName) {
    // 1. Applique l'attribut data-theme au document HTML
    document.documentElement.setAttribute('data-theme', themeName);
    
    // 2. Permutation dynamique du logo selon le thème
    const logoImg = document.getElementById('site-logo');
    if (logoImg) {
        if (themeName === 'light') {
            logoImg.src = './img/logo_fond_blanc.png';
        } else if (themeName === 'dark') {
            logoImg.src = './img/logo_fond_noir.png';
        } else if (themeName === 'red') {
            logoImg.src = './img/logo_fond_rouge.png';
        }
    }

    // 3. Mise à jour visuelle des pastilles de sélection de thème
    document.querySelectorAll('.theme-dot').forEach(dot => {
        dot.classList.remove('active');
    });

    if (themeName === 'light') {
        document.querySelector('.dot-light')?.classList.add('active');
    } else if (themeName === 'dark') {
        document.querySelector('.dot-dark')?.classList.add('active');
    } else if (themeName === 'red') {
        document.querySelector('.dot-red')?.classList.add('active');
    }
}