
const menuStyles = `
.menu { 
    position: fixed;
    top: 50px;
    bottom: 50px;
    font-size: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    z-index: 2;
    padding-left: 15px;
    padding-right: 50px;
    border-image-width: 10px 10px 10px 10px;
    animation: 5s animate;
    animation-iteration-count: infinite;
    __background: linear-gradient(-45deg, #ff3c00, #d50053, #e09300, #d4d101);
    __background-size: 400% 400%;                
    background-color: #0008;
    backdrop-filter: blur(2px);
    transition-property: scale;
    transition-duration: 0.2s;
    transition-timing-function: cubic-bezier(.68,-0.55,.27,1.55);
    clip-path: polygon(66.7% 2.8%, 99% 5%, 92.9% 55%, 100.2% 89.5%, 49.6% 100.3%, 0.5% 90.8%, 3.7% 54.5%, 0% 9.3%, 27.5% 1.5%, 50.1% 3.5%);
}

.menu.close {
    scale: 0% !important;
}


.menu-item {
    cursor: pointer;
    align-self: center;
    width: 80%;
    border-width: 4px 4px 8px 4px;
    border-image: linear-gradient(to bottom, red 0%, rgba(0, 0, 0, 0) 100%) 1 100%;                
    text-align: center;
    margin: 18px 0;
    border-style: solid;
    box-shadow: 0px -1px 0px #e11e1e, 0px 1px 0px #3f0a0a;
    padding: 0 8px;
    height: 24px;
    line-height: 150%;
    background-color: darkred;
    text-shadow: 2px 2px 2px black;
    font-weight: bolder;
    filter: blur(0.5px);
    animation-name: shake;
    animation-duration: 1s;
    animation-direction: normal;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
}

.menu-item:hover, .menu-item.selected {
    filter: brightness(1.4) blur(0.5px);
    transform: scale(1.01);
    animation-name: unset;
}

.menu-item::after {
    position: absolute;
    content: "";
    width: 100%;
    height: 160%;
    left: 0;
    top: -3px;
    box-shadow: -5px -7px 5px black;
    z-index: 1;
}


meter {
  -webkit-appearance: none; 
  border-radius: 8px;
  padding: 0px 0px 0px 0;
  height: 12px;
  background: #250000;
  box-shadow: 0 -1px 0px black, 1px 0 1px black, -2px 0 1px black;
  float: right;
  margin: 11px 0;
  cursor: e-resize;
  z-index: 3;
  position: relative;  
}

meter::-moz-meter-bar {
  background: linear-gradient(to bottom, black 0, #a1a2d5 20%, #d1828d 80%, black 100%);
}

.onoff {
    width: 30px;
    height: 17px;
    border: 2px solid black;
    border-radius: 9px;
    background-color: red;
    background-image: radial-gradient(circle at 28%, #999 35%, black 37%); 
}

.onoff[value="on"],.onoff[value="1"],.onoff[value="true"] {
    background-image: radial-gradient(circle at 72%, #01d001 35%, black 37%);
}

.select-arrow {
    user-select: none; 
    cursor: pointer; 
    position: relative; 
    z-index: 3;
}

.select-arrow:hover {
    filter: brightness(1.4);    
}

@keyframes shake {
    0% {
        rotate: 0;
    }

    30% {
        rotate: 1deg;
        translate: 1px 2px;
    }

    70% {
        rotate: -1deg;
        translate: -1xp -2px;
    }

    100% {
        rotate: 0;
    }
}

@keyframes animate {
  0% {
      transform: skew(1deg,-1deg) scaleY(1);
  }
  50% {
      transform: skew(-1deg,1deg) scaleY(0.99);
  }
  100% {
      transform: skew(1deg,-1deg) scaleY(1);
  }
}
`;

class Menu {
    constructor(menuData, {
        title = '',
        position = 'center',
        font = 'arial',
        open = false,
        background = 'rgb(0, 7, 42)',
        width = '15%'
    } = {}) {
        this.data = menuData ?? test;
        this.title = title;
        this.font = font;
        this.position = position;
        this.open = open;
        
        this.container = document.createElement('div');
        if (this.position == 'center') {
            this.container.style.left = 'calc(0.5 * '+innerWidth+'px - 0.5 * '+width+')';
            this.container.style.paddingRight = '15px';
        } else {
            this.container.style[this.position] = '-40px';
        }
        this.container.style.width = width;
        this.container.style.fontFamily = this.font;
        //this.container.style.backgroundColor = background;
        this.container.classList.add( 'menu' );
        this.container.classList.add( open ? 'open' : 'close' );

        this.containerBack = this.container.cloneNode();
        this.containerBack.style.backgroundImage = 'radial-gradient(circle at -100%, #ff8f00, transparent 76%)';        
        this.containerBack.style.scale = '1.02';
        
        document.body.appendChild(this.containerBack);
        document.body.appendChild(this.container);
        
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = menuStyles;
        document.getElementsByTagName('head')[0].appendChild(style);
        this.display();        
    }
    
    display(path = '0') {
        
        const height = 78 * (this.data[path].length + (path != '0' ? 1 : 0)) + 40 * 2;
        this.container.style.top = (window.innerHeight - height)/2 + 'px';
        this.container.style.bottom = this.container.style.top;
        this.containerBack.style.top = this.container.style.top;
        this.containerBack.style.bottom = this.container.style.bottom;
    
        this.container.innerHTML = '';
        
        if (path != '0') {
            const itemElement = document.createElement('div');
            itemElement.style.animationDelay = '0s';
            itemElement.style.animationDirection = 'reverse';
            itemElement.innerHTML = '🠈 Volver';
            itemElement.classList.add('menu-item');
            itemElement.onclick = (function () { 
                this.display(path.split('.').slice(0,-1).join('.'));
            }).bind(this);
            this.container.appendChild(itemElement);            
        }
        
        this.data[path].forEach( (item,i) => {
            const itemElement = document.createElement('div');
            itemElement.style.animationDelay = (i*0.2).toFixed(2)+'s';
            itemElement.style.animationDirection = i % 2 ? 'normal' : 'reverse';
            
            if (item.type == 'submenu') {
                itemElement.innerHTML = item.title;
                itemElement.classList.add('menu-item');
                itemElement.onclick = (function () { 
                    this.display(item.path);
                }).bind(this);
            } else if (item.type == 'action') {                
                itemElement.innerHTML = item.title;
                itemElement.classList.add('menu-item');
                itemElement.onclick = function () { 
                    const fn = eval(item.action);
                    if (typeof(fn) == 'function') {
                        fn(...eval('['+(item.params??'')+']'));
                    }
                };
            } else if (item.type == 'meter') {
                let val;
                try {
                    val = eval(item.variable);
                } catch(e) {
                    val = item.default;
                }
                itemElement.innerHTML = `<span style="float: left;">${item.title}</span><meter min="${item.min??0}" max="${item.max??100}" value="${val}"></meter>`;
                itemElement.classList.add('menu-item');
                itemElement.querySelector('meter').addEventListener('click', function (e) { 
                    const value = parseInt(item.min) + parseFloat(e.offsetX / e.target.clientWidth) * (item.max - item.min);
                    try {
                        eval(item.variable + ' = ' + value);
                    } catch(e) {
                    }
                    e.target.value = value;                    
                });
                itemElement.querySelector('meter').addEventListener('wheel', function (e) { 
                    const value = parseFloat(e.target.value) - Math.sign(e.deltaY) * (item.max - item.min) * 0.05;
                    try {
                        eval(item.variable + ' = ' + value);
                    } catch(e) {
                    }
                    e.target.value = value;                    
                });
                if (item.onchange) {
                    itemElement.querySelector('meter').addEventListener('change', function (e) { 
                        const fn = eval(item.onchange);
                        if (typeof(fn) == 'function') {
                            fn(e);
                        }
                    });
                }
            } else if (item.type == 'onoff') {
                let val, status;
                try {
                    val = eval(item.variable);
                } catch(e) {
                    val = item.default ?? 0;
                }
                if (val == 'on' || val == '1' || val == 'true') {
                    val = 1;
                } else {
                    val = 0;
                }
                itemElement.innerHTML = `
                    <span style="float: left;">${item.title}</span>
                    <div class="onoff" onclick="event.stopPropagation();this.parentNode.click();" value="${val}" style="width: 23px;height: 11px;border: 2px solid black; border-radius: 9px; float: right; margin: 6px 0;"></div>
                `;
                itemElement.classList.add('menu-item');
                //itemElement.querySelector('div').statuses = [ 'radial-gradient(circle at 28%, #bbb 35%, black 37%)', 'radial-gradient(circle at 72%, #7bd27b 35%, black 37%)'];
                itemElement.querySelector('div').value = val;
                //itemElement.querySelector('div').style.backgroundImage = itemElement.querySelector('div').statuses[val];
                itemElement.addEventListener('click', function (e) { 
                    const onoff = e.target.querySelector('div');
                    if (onoff.value == 'on' || onoff.value == '1' || onoff.value == 'true') {
                        try {
                            eval(item.variable + ' = false');
                        } catch(e) {}
                        onoff.value = 0;
                    } else {
                        try {
                            eval(item.variable + ' = true');
                        } catch(e) {}
                        onoff.value = 1;
                    }
                    onoff.setAttribute('value', onoff.value);
                    //onoff.style.backgroundImage = onoff.statuses[onoff.value];
                    if (item.onchange) {
                        const fn = eval(item.onchange);
                        if (typeof(fn) == 'function') {
                            fn(onoff.value);
                        }
                    }
                });
            } else if (item.type == 'select') {
                let val;
                try {
                    val = eval(item.variable)-0;
                } catch(e) {
                    val = item.default ?? 0;
                }
                if (isNaN(val)) val = item.default ?? 0;
                
                itemElement.style.cursor = 'default';
                
                itemElement.classList.add('menu-item');
                itemElement.index = item.options.findIndex( (o,i) => typeof(o) == 'object' ? o.value == val : o == val );
                itemElement.options = item.options;
                itemElement.value = item.options[ itemElement.index ];

                itemElement.innerHTML = `
                    <span class="select-arrow" onclick="this.parentNode.prev()" style="float: left; rotate: 45deg; top: -3px;">◣</span>
                    <div style="cursor: default; display: inline-block; z-index: 3;">${typeof(itemElement.value)=='object'?itemElement.value.text:itemElement.value}</div>
                    <span class="select-arrow" onclick="this.parentNode.next()" style="float: right; rotate: -135deg; top: 1px;">◣</span>
                `;

                itemElement.next = (function(){
                    this.index = this.index == this.options.length - 1 ? 0 : this.index + 1;
                    //this.value = typeof(this.options[ this.index ]) == 'object' ? this.options[ this.index ].value : this.options[ this.index ];
                    this.value = this.options[ this.index ];
                    this.querySelector('div').innerHTML = typeof(this.value) == 'object' ? this.value.text : this.value ;
                    try {
                         eval(item.variable + ' = "' + (typeof(this.value) == 'object' ? this.value.text : this.value) + '"' );
                    } catch(e) {}
                    if (item.onchange) {
                        const fn = eval(item.onchange);
                        if (typeof(fn) == 'function') {
                            fn.bind(this);
                            fn(this.value);
                        }
                    }
                }).bind(itemElement);
                itemElement.prev = (function(){
                    this.index = this.index == 0 ? this.options.length - 1 : this.index - 1;
                    //this.value = typeof(this.options[ this.index ]) == 'object' ? this.options[ this.index ].value : this.options[ this.index ];
                    this.value = this.options[ this.index ];
                    this.querySelector('div').innerHTML = typeof(this.value) == 'object' ? this.value.text : this.value ;
                    try {
                         eval(item.variable + ' = "' + (typeof(this.value) == 'object' ? this.value.text : this.value) + '"' );
                    } catch(e) {}
                    if (item.onchange) {
                        const fn = eval(item.onchange);
                        if (typeof(fn) == 'function') {
                            fn.bind(this);
                            fn(this.value);
                        }
                    }
                }).bind(itemElement);
                
            }

            this.container.appendChild(itemElement);
        });
        
    }
    
    isOpen() {
        return this.container.classList.contains('open');
    }
    isClosed() {
        return this.container.classList.contains('close');
    }
    show() {
        this.container.classList.remove('close');
        this.container.classList.add('open');
        this.containerBack.classList.remove('close');
        this.containerBack.classList.add('open');
        this.open = true;
    }
    hide() {
        this.container.classList.remove('open');
        this.container.classList.add('close');
        this.containerBack.classList.remove('open');
        this.containerBack.classList.add('close');
        this.open = false;
    }
}

/* menuData 
test = 
{
    "0": [
        {
            "title": "Submenu",
            "type": "submenu",   // submenu, action, meter, onoff, select 
            "path": "0.1"
        },
        {
            "title": "Action",
            "type": "action",
            "action": "console.log",
            "params": "editor, world"
        },
        {
            "title": "Meter",
            "type": "meter",
            "min": "0",
            "max": "100",
            "default": 50,
            "onchange": "console.log",
            "variable": "car.maxSpeed"
        },
        {
            "title": "OnOff",
            "type": "onoff",
            "onchange": "console.log",
            "variable": "resetGameNow"
        },
        {
            "title": "Select",
            "type": "select",
            "onchange": "console.log",
            "options": [ "opt 1", "opt 2", "opt 3" ],
            "variable": "refreshCanvas"
        }
    ],
    "0.1": [
        {
            "title": "Action 1",
            "type": "action",
            "action": "console.log",
            "params": "editor, world"
        },
        {
            "title": "Action 2",
            "type": "action",
            "action": "console.log",
            "params": "editor, world"
        },
        {
            "title": "Action 3",
            "type": "action",
            "action": "console.log",
            "params": "editor, world"
        }
    
    ]
};

*/
