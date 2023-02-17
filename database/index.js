// 获取数据库
const db = wx.cloud.database()

class PWCollection{
  constructor(collectionName){
    this.colName = db.collection(collectionName)
  }
  add(data){
    return this.colName.add({
      data
    })
  }
  remove(condition,isDoc = true){
    if(isDoc){
      return this.colName.doc(condition).remove()
    }else{
      return this.colName.where(condition).remove()
    }
  }
  update(condition,data,isDoc = true){
    if(isDoc){
      return this.colName.doc(condition).update({data})
    }else{
      return this.colName.where(condition).update({data})
    }
  }
  query(condition = {},isDoc = false,offset=0,size=20){
    if(isDoc){
      return this.colName.doc(condition).get()
    }else{
      return this.colName.where(condition).skip(offset).limit(size).get()
    }
  }
}
export const favorCol = new PWCollection("m_collect")
export const likeCol = new PWCollection("m_like")
export const recordCol = new PWCollection("m_record")
export const menuCol = new PWCollection("m_menu")