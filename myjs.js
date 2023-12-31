var Defaults = {}
  , Is = {};
Is.mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
Is.pointerFine = window.matchMedia("(pointer: fine)").matches;
var Utils = {
    round: function(e) {
        return Math.round(100 * e) / 100
    },
    lerp: function(e, t, i) {
        return (1 - i) * e + i * t
    },
    prefixCss: function(e, t) {
        for (var i = ["-webkit-", "-moz-", "-ms-", "-o-", ""], n = "", r = 0; r < i.length; r++)
            n += i[r] + e + ": " + t + ";";
        return n
    }
}
  , App = function() {
    var e = document.querySelector("[data-app]")
      , t = {}
      , i = {}
      , n = {};
    function r() {
        e && (i.isLoading = !1,
        e.removeAttribute(t.loading),
        Inview.exec.onLoaded())
    }
    function o() {}
    function u() {
        i.windowWidth = window.innerWidth,
        i.windowHeight = window.innerHeight
    }
    function s() {
        i.scrollPosition = window.scrollY || window.pageYOffset
    }
    return {
        init: function() {
            e && (t.loading = "data-loading",
            i.windowWidth = window.innerWidth,
            i.windowHeight = window.innerHeight,
            i.scrollPosition = window.scrollY || window.pageYOffset,
            i.mouseX = 0,
            i.mouseY = 0,
            i.isLoading = e.hasAttribute(t.loading),
            n.resizeThrottle = null,
            n.resizeTimeout = 250,
            u(),
            s(),
            window.addEventListener("load", function() {
                r()
            }, !1),
            window.addEventListener("resize", function() {
                window.clearTimeout(n.resizeThrottle),
                n.resizeThrottle = setTimeout(function() {
                    u()
                }, n.resizeTimeout)
            }, !1),
            window.addEventListener("scroll", function() {
                s()
            }, !1),
            window.addEventListener("mousemove", function(e) {
                e = e || window.event,
                i.mouseX = e.clientX,
                i.mouseY = e.clientY
            }, !1),
            Navbar.init(),
            Clock.init(),
            ThemeSwitch.init(),
            Inview.init(),
            Cursor.init())
        },
        is: {
            loading: function() {
                return i.isLoading
            }
        },
        get: {
            element: function() {
                return e
            },
            windowWidth: function() {
                return i.windowWidth
            },
            windowHeight: function() {
                return i.windowHeight
            },
            mouseX: function() {
                return i.mouseX
            },
            mouseY: function() {
                return i.mouseY
            },
            scrollPosition: function() {
                return i.scrollPosition
            }
        },
        exec: {
            onLoaded: r,
            onResize: o
        }
    }
}()
  , Navbar = function() {
    var e = document.querySelector("[data-navbar]")
      , t = {}
      , i = {}
      , n = {};
    function r() {
        App.get.scrollPosition() >= n.visibleOffset ? (i.isVisible = !0,
        e.setAttribute(t.visible, "")) : (i.isVisible = !1,
        e.removeAttribute(t.visible)),
        window.requestAnimationFrame(r)
    }
    return {
        init: function() {
            e && (t.visible = "data-visible",
            i.isVisible = e.hasAttribute(t.visible),
            n.visibleOffset = 80,
            window.requestAnimationFrame(r))
        },
        is: {
            visible: function() {
                return i.isVisible
            }
        },
        get: {
            element: function() {
                return e
            }
        },
        exec: {}
    }
}()
  , Clock = function() {
    var e = document.querySelector("[data-clock]")
      , t = {}
      , i = {};
    function n() {
        t.dateFull = new Date,
        t.dateTime = String(t.dateFull.getHours()).padStart(2, "0") + ":" + String(t.dateFull.getMinutes()).padStart(2, "0"),
        i.clockTimer = setTimeout(n, i.clockTimeout),
        e.innerHTML = t.dateTime
    }
    return {
        init: function() {
            e && (t.dateFull = null,
            t.dateTime = "",
            i.clockTimer = null,
            i.clockTimeout = 1e3,
            n())
        },
        is: {},
        get: {
            element: function() {
                return e
            },
            dateFull: function() {
                return t.dateFull
            },
            dateTime: function() {
                return t.dateTime
            }
        },
        exec: {}
    }
}()
  , ThemeSwitch = function() {
    var i = document.querySelectorAll("[data-themeswitch]")
      , e = {}
      , n = {};
    function t() {
        e.theme = "data-theme",
        n.themes = ["dark", "light"],
        n.currentTheme = function() {
            localStorage.getItem("theme") || o();
            return localStorage.getItem("theme")
        }()
    }
    function r() {
        for (var t = 0; t < i.length; t++)
            i[t].addEventListener("click", function(e) {
                e.preventDefault(),
                function() {
                    for (var e = 0; e < n.themes.length; e++)
                        if (n.currentTheme != n.themes[e]) {
                            e > n.themes.length && (e = 0),
                            n.currentTheme = n.themes[e];
                            break
                        }
                    u()
                }(i[t])
            }, !1)
    }
    function o() {
        localStorage.setItem("theme", App.get.element().getAttribute(e.theme))
    }
    function u() {
        App.get.element().setAttribute(e.theme, n.currentTheme),
        o()
    }
    return {
        init: function() {
            0 < i.length && (t(),
            r(),
            u())
        },
        is: {},
        get: {
            elements: function() {
                return i
            },
            themes: function() {
                return n.themes
            },
            currentTheme: function() {
                return n.currentTheme
            }
        },
        exec: {}
    }
}()
  , Inview = function() {
    var t = document.querySelectorAll("[data-inview]")
      , i = {}
      , n = [];
    function e() {
        return "IntersectionObserver"in window && 0 < t.length
    }
    function r(e) {
        var t = this;
        t.element = e,
        t.children = [],
        t.observed = !1,
        t.observer = null,
        t.init = function() {
            "IntersectionObserver"in window && (t.observer = new IntersectionObserver(function(e) {
                e.forEach(function(e) {
                    e.isIntersecting && t.trigger()
                })
            }
            ,{
                rootMargin: "-10% 0%"
            }),
            t.observer.observe(t.element))
        }
        ,
        t.trigger = function() {
            t.observed || (t.observed = !0,
            t.observer && t.observer.unobserve(t.element),
            t.element.setAttribute(i.visible, ""))
        }
    }
    return {
        init: function() {
            e() && (i.visible = "data-visible",
            function() {
                for (var e = 0; e < t.length; e++)
                    n.push(new r(t[e]))
            }())
        },
        is: {},
        get: {
            elements: function() {
                return t
            },
            inviewElements: function() {
                return n
            }
        },
        exec: {
            onLoaded: function() {
                e() && function() {
                    for (var e = 0; e < n.length; e++)
                        n[e].init()
                }()
            }
        }
    }
}()
  , Cursor = function() {
    var i = document.querySelector("[data-cursor]")
      , n = {}
      , r = {}
      , e = {}
      , o = {};
    function t() {
        if (o.links)
            for (var e, t = 0; t < o.links.length; t++)
                (e = o.links[t]).addEventListener("mouseenter", function() {
                    r.isHovering = !0,
                    i.setAttribute(n.hover, "")
                }, !1),
                e.addEventListener("mouseleave", function() {
                    r.isHovering = !1,
                    i.removeAttribute(n.hover)
                }, !1)
    }
    function u() {
        r.cursorX = Utils.lerp(r.cursorX, App.get.mouseX(), e.easing),
        r.cursorY = Utils.lerp(r.cursorY, App.get.mouseY(), e.easing),
        i.setAttribute("style", Utils.prefixCss("transform", "translate3d(" + Utils.round(r.cursorX) + "px, " + Utils.round(r.cursorY) + "px, 0px)")),
        window.requestAnimationFrame(u)
    }
    return {
        init: function() {
            Is.pointerFine && i && (r.cursorX = 0,
            r.cursorY = 0,
            r.isVisible = !1,
            r.isHovering = !1,
            n.visible = "data-visible",
            n.hover = "data-hover",
            e.easing = .15,
            e.visibleTimer = null,
            e.visibleTimeout = 1e3,
            o.links = document.querySelectorAll('a, button, input[type="button"], input[type="submit"], input[type="reset"]'),
            document.addEventListener("mousemove", function() {
                clearTimeout(e.visibleTimer),
                r.isVisible = !0,
                i.setAttribute(n.visible, ""),
                e.visibleTimer = setTimeout(function() {
                    r.isVisible = !1,
                    i.removeAttribute(n.visible)
                }, e.visibleTimeout)
            }, !1),
            t(),
            window.requestAnimationFrame(u))
        },
        is: {
            visible: function() {
                return r.isVisible
            },
            hovering: function() {
                return r.isHovering
            }
        },
        get: {
            element: function() {
                return i
            }
        },
        exec: {}
    }
}();
App.init();
