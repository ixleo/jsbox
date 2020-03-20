import {tool as $, loading, alert, toast} from 'tacl-ui';

export function getTypeByFix (lib) {
    return (lib.substr(lib.lastIndexOf('.')) === '.css') ? 'style' : 'script';
}

let Libs = [];

function checkIsJsBoxLib (item) {
    if (item.indexOf('jsbox.') === 0) {
        return item.replace('jsbox.', '');
    }
    return item;
}

function isUsefullLib (name) {
    if (!name) {return false;}
    return !(typeof name === 'string' && name.indexOf('jsbox.') === 0);
}

function checkResource (libs, array) {
    let res = [];
    let allDeps = [];
    for (let i = 0; i < array.length; i++) {
        let url, type, name;
        let item = array[i];
        item = checkIsJsBoxLib(item);
        name = item;
        let deps = [];
        let inLib = false;
        for (let j = 0; j < libs.length; j++) {
            let singleLib = libs[j];
            let lib = singleLib[item];
            if (isUsefullLib(lib)) {
                if (typeof lib === 'object') {
                    url = lib.url;
                    type = lib.type || getTypeByFix(url);
                    if (lib.deps) {
                        deps = lib.deps;
                        allDeps.push(...deps);
                    }
                } else {
                    url = lib;
                    type = getTypeByFix(lib);
                }
                inLib = true;
                break;
            }
        }
        if (!inLib) {
            let index = item.lastIndexOf('.');
            let fileName = item.substr(index);
            if (index === -1 || (fileName !== '.css' && fileName !== '.js')) {
                url = `https://unpkg.com/${name}`;
                type = 'script';
            } else {
                url = item;
                type = getTypeByFix(item);
            }
        }
        res.push({
            url, type, name, deps
        });
    }
    for (let i = 0; i < res.length; i++) {
        let name = res[i].name;
        if (allDeps.indexOf(name) !== -1 || Libs.indexOf(name) !== -1) {
            res.splice(i, 1);
            i--;
        } else {
            Libs.push(name);
        }
    }
    return res;
}

export const LOAD_TYPE = {
    SET: 'set',
    CONFIG: 'config',
};

export function loadResources ({
    libs = [],
    array,
    success = () => {},
    jsboxLib = true,
    showToast = true,
    isDep = false
}) {
    if (array.length === 0) {
        return;
    }
    if (!(libs instanceof Array)) {
        libs = [libs];
    }
    if (jsboxLib) {
        libs.push(window.jsbox_libs);
    }
    array =  checkResource(libs, array);
    if (array.length === 0) {
        success();
        return;
    }
    let stopLoad = false;
    let num = 0;
    loading(`${(isDep) ? '依赖: ' : ''}0 / ${array.length}`);
    array.forEach((item) => {
        let appendOne = (ele) => {
            let timer = setTimeout(() => {
                if (stopLoad) {return;}
                stopLoad = true;
                loadError(item);
            }, 8000);
            ele.el.onload = function () {
                if (stopLoad) {return;}
                num ++;
                if (num >= array.length) {
                    loading(`${(isDep) ? '依赖: ' : ''}${num} / ${array.length}`);
                    if (isDep) {
                        loading('继续加载主包...');
                    } else {
                        loading.close();
                        if (showToast) {
                            toast(`所有${(isDep) ? '依赖: ' : '资源'}加载成功!`);
                        }
                    }
                    if (success)success();
                } else {
                    loading(`${num} / ${array.length}`);
                }
                clearTimeout(timer);
            };
            ele.el.onerror = function () {
                if (stopLoad) {return;}
                stopLoad = true;
                loadError(item);
                clearTimeout(timer);
            };
        };

        let ele;
        if (item.type === 'script') {
            let addScript = () => {
                ele = $.create('script').attr('src', item.url);
                $.query('body').append(ele);
                appendOne(ele);
            };
            if (item.deps && item.deps.length > 0) {
                loadResources({
                    libs,
                    jsboxLib: false,
                    array: item.deps,
                    success: addScript,
                    isDep: true
                });
            } else {
                addScript();
            }
        } else {
            ele = $.create('link').attr({
                rel: 'stylesheet',
                href: item.url
            });
            $.query('head').append(ele);
            appendOne(ele);
        }
    });
}

function loadError (item) {
    loading.close();
    let text = null;
    if (!item.url) {
        text = '请输入正确的url地址';
    } else if (item.url === item.name) {
        text = item.url;
    } else {
        text = `${item.name}:${item.url}`;
    }
    alert({
        title: '资源加载失败',
        confirmText: '关闭',
        theme: 'gamer',
        text
    });
}