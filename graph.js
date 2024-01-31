
// 定义一个空列表来存储文件中的每一行
var graph = []
var nodeMap = {}


function print(...a){
    console.log(...a)
}
    

function createNode(name){
    return {
        "name":name,
        "p":new Set(),
        "ref":{}
    }
}

function appendChild(node, p2Name, childName){
    ref = node.ref[childName]
    if (!ref){
        node["ref"][childName] = new Set()
        node["ref"][childName].add(p2Name)
    }
}
    
function appendParents(node, p1){
    node["p"].add(p1)
}
    
function getNode(name){
    node = nodeMap[name]
    if (!node){
        node = createNode(name)
        nodeMap[name] = node
    }
    return node
} 

function init(){
    // 定义正则表达式
    let pattern = /\d*[\.]*(.*)[\+]{1}(.*)[\=]{1}(.*)/g
    
    lines.forEach(line => {
        if (line != "") {
            // 使用正则表达式匹配字符串
            let match;
            
            pattern.lastIndex = 0;
            if ((match = pattern.exec(line)) !== null) {

                // 获取正则小括号内匹配的内容
                p1 = match[1]
                p2 = match[2]
                c = match[3]

                nodeP1 = getNode(p1)
                appendChild(nodeP1, p2, c)
                
                nodeP2 = getNode(p2)
                appendChild(nodeP2, p1, c)

                nodec = getNode(c)
                appendParents(nodec, p1)
                appendParents(nodec, p2)
            }

            
        }
    
    });

}
    
    
//获取路线
var routes = []
var beforeList = {}

function findBfs(name, toName){

    routes = []
    beforeList = {}

    console.log(nodeMap[name], nodeMap[toName])

    if (nodeMap[name] == null || nodeMap[toName] == null){
        print("不存在")
        return
    }    

    var node = nodeMap[name]
    
    var visited = new Set()
    visited.add(name)
    nextP = []
    nextP.push({
        "name":name,
        "routeList":[],
        "routeSet":new Set()
    })
  
    i = 0
    while (i < nextP.length){
        ni = nextP[i]
        i+=1
        
        ni.routeList.push(ni.name)
        ni.routeSet.add(ni.name)

        // 到达终点
        if (ni.name == toName){
            routes.push(ni.routeList)
            
            continue
        }

        curNode = nodeMap[ni.name]

        ni.ref = curNode.ref

        //路径长度超过10，放弃查找
        // if (len(ni["routeList"].keys()) > 10){
        //     continue
        // }

        if (ni.ref == null || ni.ref.length == 0){
            continue
        }

        for (let c in ni.ref) {
            
            // 判断是否出现环路
            if (ni.routeSet.has(c)){
                continue
            }

            if (visited.has(c)){
                if (beforeList[c] == null){
                    beforeList[c] = []
                }
                beforeList[c].push(ni.routeList)
                continue
            }

            visited.add(c)

            next = {
                "name":c,
                "routeList":JSON.parse(JSON.stringify(ni.routeList)),
                "routeSet":new Set(ni.routeSet)
            }
     
            nextP.push(next)
        }
       
    }

    console.log(routes)
    console.log(beforeList)
        
}


function showPath(list){
    var res = "";

    for (var i = 1; i < list.length; i++) {
        var before = list[i - 1];
        var cur = list[i];
        
        var bNode = nodeMap[before];

        var w = bNode.ref[cur]

        if (w){
            var str = (" -> " + before + "+" + Array.from(w).join("|") + "=");
        
            res += str + "<a href=\"javascript:" + "showOtherResult('"+ cur +"', beforeList['"+ cur +"']);" + "\">"+ cur +"("+ (!beforeList[cur] ? 0 : beforeList[cur].length) +") </a>"
      
        }
    }

    return res;
}
    