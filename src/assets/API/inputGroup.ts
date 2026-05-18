export function getGroup(Classlist:any) {
    const groupSelect = [];
    for (let x = 0; x < Classlist.length; x++) {
        Classlist[x].children = []
        for (let m = 0; m < Classlist.length; m++) {
            if (Classlist[m].dis2 == Classlist[x].dis) {
                Classlist[x].children.push(Classlist[m])
            }
        }
    }
        for (let i = 0; i < Classlist.length; i++) {
            if (Classlist[i].dis2 == 0) {
                const listData = { key: Classlist[i].code, value: Classlist[i].code, label: Classlist[i].name, children: [] };
                listData.children = listDataChildren(Classlist[i].children, listData);
                groupSelect.push(listData);
            }
        }
        return groupSelect
};

function listDataChildren(ChildrenData: any, listData:any) {
    let b01: any = [];
    const d01: any = [];
    for (let a = 0; a < ChildrenData.length; a++) {
        b01 = { key: ChildrenData[a].code, value: ChildrenData[a].code, label: ChildrenData[a].name, children: [] };
        d01.push(b01);
        b01.children = listDataChildren(ChildrenData[a].children, b01)
    }
    if (d01.length !== 0) {
        listData.children = d01
    }
    return listData.children
}

export function getMenu(Classlist: any) {
    const groupSelect = [];
    for (let x = 0; x < Classlist.length; x++) {
        Classlist[x].children = []
        for (let m = 0; m < Classlist.length; m++) {
            if (Classlist[m].dis == Classlist[x].dis2) {
                Classlist[x].children.push(Classlist[m])
            }
        }
    }
    for (let i = 0; i < Classlist.length; i++) {
        if (Classlist[i].dis == 0) {
            const listData = Classlist[i];
            listData.children = getChildren(Classlist[i].children, listData);
            groupSelect.push(listData);
        }
    }
    return groupSelect
};

function getChildren(ChildrenData: any, listData: any) {
    let b01: any = {};
    const d01: any = [];
    for (let a = 0; a < ChildrenData.length; a++) {
        b01 = ChildrenData[a];
        d01.push(b01);
        b01.children = getChildren(ChildrenData[a].children, b01)
    }
    if (d01.length !== 0) {
        listData.children = d01
    }
    return listData.children
}

export function getGroupFileList(Classlist: any) {
    const groupFileList = [];
    for (let x = 0; x < Classlist.length; x++) {
        Classlist[x].children = []
        for (let m = 0; m < Classlist.length; m++) {
            if (Classlist[m].dis2 == Classlist[x].dis) {
                Classlist[x].children.push(Classlist[m])
            }
        }
    }
    for (let i = 0; i < Classlist.length; i++) {
        if (Classlist[i].dis2 == 0) {
            const listData = Classlist[i];
            listData.children = getChildren(Classlist[i].children, listData);
            groupFileList.push(listData);
        }
    }
    return groupFileList
};

export function getfilesName(rows: any, filesName: any) {
    for (let m = 0; m < rows.length; m++) {
        if (rows[m].imgName != '') {
            filesName.push(rows[m].imgName + '(' + rows[m].fileNumber + ')')
        }
        if (rows[m].children.length > 0) {
            const childrenName = getfilesChildren(rows[m].children, filesName)
            filesName.concat(childrenName)
        }
    }
    return filesName
}

function getfilesChildren(rows: any, filesName: any) {
    for (let m = 0; m < rows.length; m++) {
        if (rows[m].imgName != '') {
            filesName.push(rows[m].imgName + '(' + rows[m].fileNumber + ')')
        }
        if (rows[m].children.length > 0) {
            const childrenName = getfilesChildren(rows[m].children, filesName)
            filesName.concat(childrenName)
        }
    }
    return filesName
}

export function getRowData(groupListData: any, groupFileListData: any) {
    for (let m = 0; m < groupFileListData.length; m++) {
        groupListData.push({
            dis: groupFileListData[m].dis,
            dis2: groupFileListData[m].dis2,
            fileNumber: groupFileListData[m].fileNumber,
            id: groupFileListData[m].id,
            imgName: groupFileListData[m].imgName,
            verify: groupFileListData[m].verify
        })        
        if (groupFileListData[m].children.length > 0) {
            getRowData(groupListData, groupFileListData[m].children)
        }
    }
    return groupListData
}

export function getNewGroupFileList(Classlist: any) {
    for (let x = 0; x < Classlist.length; x++) {
        Classlist[x].dis2 = 0+'';
        Classlist[x].dis = (100 + x).toString()
        Classlist[x].children = getNewChildren(Classlist[x].children, Classlist[x])
    }
    return Classlist
}

function getNewChildren(children: any, Classlist: any) {
    for (let i = 0; i < children.length; i++) {
        children[i].dis2 = Classlist.dis;
        children[i].dis = Classlist.dis+ '-' + i;
        children[i].children = getNewChildren(children[i].children, children[i])
    }
    return children
}

export function getGroupPath(List: any, Data: any, groupPath: any) {
    for (let i = 0; i < List.length; i++) {
        if (List[i].dis == Data.dis2) {
            groupPath.unshift(List[i].dis)
            Data = List[i]
            if (List[i].dis2 == 0) {
                return groupPath
            }
            getGroupPath(List, Data, groupPath)
        }
    }
    return groupPath
}
