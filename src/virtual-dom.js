export const createVNode = (tag, attributes = {}, children = []) => {
    return {
        tag,
        attributes,
        children,
    };
};

export const mount = (AppComponent, state, target) => {
    const vNode = AppComponent(state);
    target.appendChild(render(vNode));

    return {
        AppComponent,
        target,
        vNode: vNode,
    };
};

export const changeState = (app, state) => {
    const newVNode = app.AppComponent(state);
    patch(app.target, diff(app.vNode, newVNode, app.target, 0));
    app.vNode = newVNode;
};

const render = vNode => {
    if(!vNode) return;

    return typeof vNode === 'string'
        ? createTextNode(vNode)
        : createElementNode(vNode);
};

const createTextNode = string => {
    return document.createTextNode(string);
};

const createElementNode = vNode => {
    let element = document.createElement(vNode.tag);

    for(const attr in vNode.attributes) {
        element.setAttribute(attr, vNode.attributes[attr]);
    }

    for(const child of vNode.children) {
        if(!child) continue;
        element.appendChild(render(child));
    }

    return element;
};

const diff = (oldVNode, newVNode, parentNode, index) => {
    let patch = {};

    if(oldVNode === newVNode) {
        patch = { type: 'KEEP' };
    }

    if(oldVNode && !newVNode) {
        patch = { type: 'REMOVE_NODE' }
    }

    if(!oldVNode && newVNode) {
        patch = {
            type: 'INSERT_NODE',
            nextNode: parentNode.childNodes[index],
            newVNode
        };
    }

    if(
        typeof oldVNode === 'string' &&
        typeof newVNode === 'string'
    ) {
        patch = { type: 'UPDATE_TEXT', newVNode };
    }

    if(
        typeof oldVNode === 'object' &&
        typeof newVNode === 'object' &&
        oldVNode && newVNode &&
        oldVNode.tag !== newVNode.tag
    ) {
        patch = { type: 'REPLACE_NODE', newVNode };
    }

    if(
        typeof oldVNode === 'object' &&
        typeof newVNode === 'object' &&
        oldVNode && newVNode &&
        oldVNode.tag === newVNode.tag
    ) {
        patch = {
            type: 'UPDATE_NODE',
            oldVNode,
            newVNode,
            children: diffChildren(oldVNode, newVNode, parentNode, index),
        };
    }

    return {
        ...patch,
        index,
        node: parentNode.childNodes[index],
        parentNode,
    };
};

const diffChildren = (oldVNode, newVNode, parentNode, index) => {
    // ensure both children are of the same length
    if(newVNode.children.length < oldVNode.children.length) {
        const padding = Array(oldVNode.children.length - newVNode.children.length).fill(null);
        newVNode.children = [
            ...newVNode.children,
            ...padding,
        ];
    }

    return newVNode.children.map((newChildVNode, childIndex) => {
        return diff(
            oldVNode.children[childIndex],
            newChildVNode,
            parentNode.childNodes[index],
            childIndex
        );
    });
};

const patch = (parentNode, diff) => {
    if(diff.type === 'KEEP') {
        return;
    }

    if(diff.type === 'REMOVE_NODE') {
        parentNode.removeChild(diff.node);
        return;
    }

    if(diff.type === 'INSERT_NODE') {
        parentNode.insertBefore(render(diff.newVNode), diff.nextNode);
        return;
    }

    if(diff.type === 'UPDATE_TEXT') {
        diff.node.textContent = diff.newVNode;
        return;
    }

    if(diff.type === 'REPLACE_NODE') {
        diff.node.replaceWith(render(diff.newVNode));
        return;
    }

    if(diff.type === 'UPDATE_NODE') {
        const allAttributes = {
            ...diff.oldVNode.attributes,
            ...diff.newVNode.attributes,
        };

        for(const key in allAttributes) {
            patchAttribute(diff.node, key, diff.oldVNode, diff.newVNode);
        }

        diff.children.forEach(childDiff => {
            patch(diff.node, childDiff);
        });
    }
};

const patchAttribute = (node, key, oldVNode, newVNode) => {
    if(oldVNode.attributes[key] === newVNode.attributes[key]) {
        return;
    }

    if(!key in newVNode.attributes) {
        node.removeAttribute(key);
    }

    node.setAttribute(key, newVNode.attributes[key]);
};
