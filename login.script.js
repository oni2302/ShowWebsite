import { MorphSVGPlugin } from "./MorphSVGPlugin.js";
// Các biến bộ phận 
var EyeL = document.getElementById("EyeL");
var EyeR = document.getElementById("EyeR");
var Nose = document.getElementById("Nose");
var Mount = document.getElementById("Mount");
var Arm = document.getElementById("Arm");
// Các hằng số
const AnimateDuration = 1;
const CoverDuration = 0.75;
const EyeMoveX = 80;
const EyeMoveY = 5;
const NoseMoveX = 150;
const NoseMoveY = 5;
const MountMoveX = 120;
const MountMoveY = -10;

const DefaultFocusHead = 0.3
// Lấy toàn bộ web
var Website = document.querySelector("body");
//Biến thay đổi
var isFocusPassword = false;
var isHidePassword = true;
var isPasswordMouseLeave = true;
// Biến thẻ
var emailInput = document.getElementById('email');
var passwordInput = document.getElementById('password');
var passwordGroup = document.querySelector('.inputG');
// Tạo hiệu ứng xoay đầu

var tuningHead = gsap.timeline({ defaults: { duration: Website.clientWidth } }),
    headNor = document.getElementById("head-nor"),
    headShadowNor = document.getElementById("head-shadow-nor"),
    earRightNor = document.getElementById("ear-nor-r"),
    earRightShadowNor = document.getElementById('ear-nor-r-shadow'),
    earLeftNor = document.getElementById("ear-nor-l"),
    earLeftShadowNor = document.getElementById('ear-nor-l-shadow'),
    bodyNorShadow = document.getElementById('body-nor-shadow');
tuningHead.to(headNor, { morphSVG: "#head-look" }, "1")
    .to(headShadowNor, { morphSVG: "#head-shadow-look" }, "1")
    .to(earRightNor, { morphSVG: "#ear-look-r" }, "1")
    .to(earRightShadowNor, { morphSVG: "#ear-look-r-shadow" }, "1")
    .to(earLeftNor, { morphSVG: "#ear-look-l" }, "1")
    .to(earLeftShadowNor, { morphSVG: "#ear-look-l-shadow" }, "1")
    .to(bodyNorShadow, { morphSVG: "#body-look-shadow" }, "1");
// headShadow.to(headShadowNor, { morphSVG: "#head-shadow-look" }, "+=1");
async function glimpse(isGlimpse) {
    if (isGlimpse) {
        const glimpseUnit = 0.8;
        lookAt(glimpseUnit);
    } else {
        const glimpseUnit = 0;
        turnHead(glimpseUnit);
        gsap.to(EyeR, CoverDuration, { x: glimpseUnit * EyeMoveX, y: glimpseUnit * EyeMoveY, ease: Expo.easeOut })
        gsap.to(EyeL, CoverDuration, { x: glimpseUnit * EyeMoveX, y: glimpseUnit * EyeMoveY, ease: Expo.easeOut })
        gsap.to(Nose, CoverDuration, { x: glimpseUnit * NoseMoveX, y: glimpseUnit * NoseMoveY, ease: Expo.easeOut })
        gsap.to(Mount, CoverDuration, { x: glimpseUnit * MountMoveX, y: glimpseUnit * MountMoveY, ease: Expo.easeOut })
    }

}
function coverEyes(isCover) {
    if (isCover) {
        gsap.to(Arm, CoverDuration, { rotate: 152, x: 51, y: -53, ease: Expo.easeOut })
    } else {
        gsap.to(Arm, CoverDuration, { rotate: 0, x: -0, y: -0, ease: Expo.easeOut })
    }
}
// addEventListener("mousedown", async (event) => {
//     coverEyes();
//     
// });
// Thiết lập các listener
emailInput.onkeydown = () => {
    updatePosition();
}
emailInput.onfocus = () => {
    
    if(isFocusPassword==false){
        coverEyes(false);
    }
    lookAt(DefaultFocusHead);
}
emailInput.onblur = () => {
    lookAt(0);
}
passwordInput.onfocus = () => {
    
    isFocusPassword = true;
    coverEyes(true)
}
passwordInput.onblur = () => {
    
    isFocusPassword=false;
    if (isPasswordMouseLeave) {
        coverEyes(false);
    }
}
passwordGroup.onmouseout = ()=>{
    console.log('leave');
    isPasswordMouseLeave = true;
}
passwordGroup.onmousemove=()=>{
    isPasswordMouseLeave=false;

    
    console.log('enter');
}
// Tạo hiệu ứng chuyển động khi di chuột
function lookAt(progress) {
    gsap.to(EyeR, AnimateDuration, { x: progress * EyeMoveX, y: progress * EyeMoveY, ease: Expo.easeOut })
    gsap.to(EyeL, AnimateDuration, { x: progress * EyeMoveX, y: progress * EyeMoveY, ease: Expo.easeOut })
    gsap.to(Nose, AnimateDuration, { x: progress * NoseMoveX, y: progress * NoseMoveY, ease: Expo.easeOut })
    gsap.to(Mount, AnimateDuration, { x: progress * MountMoveX, y: progress * MountMoveY, ease: Expo.easeOut })

    tuningHead.progress(progress);
};

// Load web
document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(MorphSVGPlugin);
    gsap.config({ trialWarn: false });

    // gsap code here!
});

// Hàm xoay đầu
async function turnHead(targetPosition) {
    var currentPosition = (tuningHead.recent()['_time'] + 1) / tuningHead.recent()['_dur'];
    // console.log(tuningHead.recent());
    const step = 20;
    var i = 0;
    var movePoint = (targetPosition - currentPosition) / step;
    if (currentPosition < targetPosition) {
        for (let index = currentPosition; index < targetPosition; index += movePoint) {
            i++;
            await sleep(0.5);
            tuningHead.progress(index);
            // console.log(i, 0);
        }
    } else {
        for (let index = currentPosition; index > targetPosition; index += movePoint) {
            await sleep(0.5);
            tuningHead.progress(index);
        }
    }


}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function updatePosition() {
    var email = document.getElementById('email');
    var caret = email.selectionEnd;
    var copyStyle = getComputedStyle(email);
    var div = document.createElement('div');
    var span = document.createElement('span');
    [].forEach.call(copyStyle, function (prop) {
        div.style[prop] = copyStyle[prop];
    });
    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    document.body.appendChild(div);
    div.textContent = email.value.substr(0, caret);
    span.textContent = email.value.substr(caret) || '.';
    div.appendChild(span);

    var ratioW = span.offsetWidth / div.offsetWidth + DefaultFocusHead;
    div.style.display = 'none';
    if (ratioW > 1) ratioW = 1;

    lookAt(ratioW);
}


//Hide password
document.querySelector('.hidePass').onclick = async () => {
    
    isHidePassword = !isHidePassword;
    
    passwordInput.type = isHidePassword?"password":"text";
    var passwordEye = document.querySelectorAll(".passwordEye");
    await glimpse(!isHidePassword);
    passwordEye.forEach(element => {
        element.classList.toggle('hide');
    });
}

