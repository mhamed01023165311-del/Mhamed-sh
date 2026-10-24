const preloadWord = document.getElementById('preloadWord');
const gearCounter = document.getElementById('gear-counter');
const drumHundreds = document.getElementById('drum-hundreds');
const drumTens = document.querySelector('#drum-tens .drum-strip');
const drumUnits = document.querySelector('#drum-units .drum-strip');

const preloader = document.getElementById('preloader');
const mainPage = document.getElementById('main-page');
const lightSpeedBg = document.getElementById('light-speed-bg');

function createStreaks() {
    for(let i = 0; i < 80; i++) {
        let streak = document.createElement('div');
        streak.classList.add('streak');
        if(Math.random() > 0.5) streak.classList.add('red');
        streak.style.top = Math.random() * 100 + '%';
        streak.style.left = '-20%'; 
        lightSpeedBg.appendChild(streak);
    }
}
createStreaks();

function updateCounter(val) {
    if (val >= 100) {
        drumHundreds.style.width = '34px';
        val = 00;
    }
    let strVal = val.toString().padStart(2, '0');
    let t = parseInt(strVal[0]);
    let u = parseInt(strVal[1]);

    drumTens.style.transform = `translateY(-${t * 48}px)`;
    drumUnits.style.transform = `translateY(-${u * 48}px)`;
}

window.onload = () => {
    gsap.to(preloadWord, { opacity: 1, duration: 1, ease: "power2.out" });
    gsap.to(gearCounter, { opacity: 1, duration: 0.8, delay: 0.3, ease: "power2.out" });

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 3) + 1;
        if (progress >= 100) {
            progress = 100;
            updateCounter(100);
            clearInterval(interval);
            setTimeout(triggerHyperJump, 300);
            return;
        }
        updateCounter(progress);
    }, 70);
};

function triggerHyperJump() {
    const tl = gsap.timeline({
        onComplete: () => {
            preloader.style.display = 'none';
        }
    });

    // إخفاء العداد وتشغيل سرعة الضوء
    tl.to(gearCounter, { opacity: 0, duration: 0.2 }, 0);
    tl.to(lightSpeedBg, { opacity: 1, duration: 0.4 }, 0.1);

    // زووم التحميل
    tl.to(preloadWord, {
        scale: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power4.in"
    }, 0.2);

    const allStreaks = document.querySelectorAll('.streak');
    allStreaks.forEach((streak) => {
        gsap.to(streak, {
            x: window.innerWidth * 3,
            duration: Math.random() * 0.8 + 0.2,
            ease: "none",
            repeat: 2
        });
    });

    // ظهور الصفحة الرئيسية
    mainPage.style.visibility = 'visible';
    tl.to(mainPage, { opacity: 1, duration: 0.8, ease: "power2.out" }, 1.0);

    // الشخص والتاج يدخلان معاً من اليسار
    tl.from('#characterGroup', { x: -300, opacity: 0, duration: 1.2, ease: "power3.out" }, 1.2);
    
    // =========================================================================
    // أنيميشن الصقر والكلمة (يبدأ بعد ثانيتين من فتح الصفحة)
    // =========================================================================
    
    // إخفاء الصقر والكلمة وتجهيزهم للأنيميشن
    gsap.set('#falconGroup', { x: -window.innerWidth, y: 50, opacity: 0 });
    gsap.set('#heroWordMain', { opacity: 0, x: -30, filter: "blur(5px)" });

    const falconTimeline = gsap.timeline({ delay: 3.5 }); // 1.5 (وقت الدخلة) + 2 ثانية انتظار = 3.5

    // 1. الصقر يطير من الشمال لليمين
    falconTimeline.to('#falconGroup', { 
        x: 0, y: 0, opacity: 1, duration: 2.5, ease: "power2.out" 
    }, 0);

    // 2. الكلمة تظهر بالتدريج (Smooth) عندما يمر الصقر من فوقها (بعد 1 ثانية من بدء طيران الصقر)
    falconTimeline.to('#heroWordMain', {
        opacity: 1, 
        x: 0, 
        filter: "blur(0px)", 
        duration: 1.5, 
        ease: "power2.out"
    }, 1.0);

    // 3. حركة طفو الصقر في الهواء بعد ما يستقر
    falconTimeline.to('#falconGroup', {
        y: -15,
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
    }, 2.5);
}
