class Player {
  constructor() {
   this.name = null;
   this.index = null;
   this.positionX = 0;
   this.positionY = 0;
   this.rank = 0;
   this.score = 0;
   this.fuel = 185;
   this.life = 300;
  }

  //método para obter o playerCount e updateCount() epara atualizar o playerCount no bd
  addPlayer(){
    var playerIndex = "players/player" + this.index;
    if(this.index === 1){
      this.positionX = width/2-100;
    }else{
      this.positionX = width/2+100;
    }
    database.ref(playerIndex).set({
      name:this.name,
      positionX:this.positionX,
      positionY:this.positionY,
      rank:this.rank,
      score:this.score
    })
  }
  getCount() {
    //ler os dados e armazenar dentro da função
    var playerCountRef = database.ref('playerCount');//referenciando ao bd
      playerCountRef.on("value", function(data) {        
      playerCount = data.val()
  });
  }
    
    getDistance(){
      var playerDistanceRaf = database.ref("players/player" + this.index)
      playerDistanceRaf.on("value",data=>{
        var data = data.val()
        this.positionX = data.positionX
        this.positionY = data.positionY
      }
      )
      
     }
     update(){
      var playerIndex = "players/player" + this.index
      database.ref(playerIndex).update({
        positionX:this.positionX,
        positionY:this.positionY,
        rank:this.rank,
        score:this.score,
        life:this.life
      })
     }
    
  
  //método para atualizar o playerCount no bd
  updateCount(count) {
    database.ref("/").update({
      playerCount:count
    });
  }
   static getPlayersInfo(){
    var playerInfoRef = database.ref("players")
    playerInfoRef.on("value",data=>{
      allPlayers = data.val()
    })
   }
   getCarsAtEnd(){
    database.ref("carsAtEnd").on("value",data=>{
      this.rank = data.val()
      
    })
 }
   static updateCarsAtEnd(rank){
     database.ref("/").update({
      carsAtEnd:rank
     })
   }
}

