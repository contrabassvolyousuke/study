document.addEventListener("DOMContentLoaded",() => {
    const ease = "power4.inOut";

    //ページ飛んだあと
    function revealTransition() {
        return new Promise((resolve)=>{
            gsap.set(".block",{scaleY:1});
            gsap.to(".block",{
                scaleY:0,
                duration:1,
                stagger:{
                    each:0.1,
                    from:"start",
                    grid:"auto",
                    axis:"x",
                },
                ease:ease,
                onComplete:resolve,
            })
        });
    }

    revealTransition().then(() =>{
        gsap.set(".block",{
            visibility: "hidden"
        });
    });


    //クリックしたあとの動作
    document.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click",(e)=>{
            e.preventDefault();//ブラウザのデフォルトリンク機能をキャンセル
            const href = link.getAttribute("href");//href要素を取得

            //「hrefが存在する」かつ「#アンカーリンクではない」かつ「現在のウェブページのパスではない」
            if(href && !href.startsWith("#") && href !== window.location.pathname) {
                animateTransition().then(() => {//animateTransition()の処理を終わったら、ページ外部URLへ遷移
                    window.location.href = href;
                });
            }
        });
    });

    function animateTransition() {
        return new Promise((resolve)=>{
            gsap.set(".block",{
                visibility:"visible",
                scaleY:0
            });
            gsap.to(".block",{
                scaleY:1,
                duration:1,
                stagger:{
                    each:0.1,
                    from:"start",
                    grid:"auto",
                    axis:"x",
                },
                ease:ease,
                onComplete:resolve,
            })
        });
    }
});
