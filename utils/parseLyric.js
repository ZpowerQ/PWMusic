const timeRegExp = /\[(\d{2}):(\d{2}).(\d{2,3})\]/
export function parseLyric(lyric,duration){
  const lyricInfos = []
  const lyricStrings = lyric.split("\n")
  for(const lyricString of lyricStrings){
    const lyricResult = timeRegExp.exec(lyricString)
    if(!lyricResult) continue
    const minute = lyricResult[1] * 60 * 1000
    const second = lyricResult[2] * 1000
    const time = minute + second + lyricResult[3] * 1
    const text = lyricString.replace(timeRegExp,"")
    lyricInfos.push({time,text})
  }
  if(lyricInfos[lyricInfos.length-1].text != ""){
    lyricInfos.push({time:duration,text:""})
  }
  lyricInfos.unshift({time:0,text:""})
  return lyricInfos

}