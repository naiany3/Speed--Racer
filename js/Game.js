class Game {
  constructor() {
    this.resetTitle = createElement("h2")
    this.resetButton = createButton("")
    this.leaderboardTitle = createElement("h2")
    this.leader1 = createElement("h2")
    this.leader2 = createElement("h2")
    this.playerMoving = false;
    this.leftKeyActive = false;
    this.blast = false;

  }

  getState() {//método que irá ler o gameState do banco de dados
      var gameStateRef = database.ref("gameState");//me referindo a chave gameState criada no bd
      //criando um ouvinte que fica acompanhando a mudança no valor da variável gameState no bd.
      gameStateRef.on("value", function(data) {        
        gameState = data.val()

    });
  }

  update(state) {//método que irá atualizar o gameState no bd para um valor passado para ele como parâmetro
    database.ref("/").update({//se refere ao banco de dados principal dentro do qual gameState é criado
      gameState:state
    });

  }
  start() {//método para obter o gameState e então iniciar o jogo
    //instância de um novo jogador
    player = new Player();
    playerCount = player.getCount();
    //inciando a variável playerCount
    form = new Form();
    form.display();

    //criar sprites dos jogadores
    car = createSprite(width/2-50,height-100)
    car.addImage("car1",carimg);
    car.addImage("blast",blastImage);
    car.scale = 0.07;

    car2 = createSprite(width+100,height-100)
    car2.addImage("car2",car2img);
    car2.addImage("blast",blastImage);
    car2.scale = 0.07;

    //atribuindo os objetos ao vetor cars
    cars = [car,car2];

    fuels = new Group();
    powerCoin = new Group();
    obstacles = new Group();
    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];
 
    this.addSprite(fuels,4,fuelImage,0.02)
    this.addSprite(powerCoin,18,powerCoinImage,0.09)
    this.addSprite(obstacles,obstaclesPositions.length,obstacle1Image,0.04,obstaclesPositions)
    this.addSprite(obstacles,obstaclesPositions.length,obstacle2Image,0.04,obstaclesPositions)

   
  }

  addSprite(spriteGroup,numberOfSprites,spriteImage,scale,position = []){
    for (let i = 0; i < numberOfSprites ; i++) {
      var x,y;
      if(position.length > 0) {
       x = position[i].x
       y = position[i].y
       spriteImage = position[i].image

      }else{
        x = random(width/2+150,width/2-150)
        y = random(-height*4.5,height - 400)

      }
      var sprite = createSprite(x,y)
      sprite.addImage("sprite",spriteImage)
      sprite.scale = scale;
      spriteGroup.add(sprite)
      
    }

    }
  
  handleElements(){
    form.hide();
    form.titleImg.position(40,50);
    form.titleImg.class("gameTitleAfterEffect");
    this.resetTitle.html("reiniciar o jogo")
    this.resetTitle.class("resetText")
    this.resetTitle.position(width/2+200,40)

    this.resetButton.class("resetButton")
    this.resetButton.position(width/2+230,100)

    this.leaderboardTitle.html("placar")
    this.leaderboardTitle.class("resetText")
    this.leaderboardTitle.position(width/3-60,40)

    this.leader1.class("leadersText")
    this.leader1.position(width/3-50,80)

    this.leader2.class("leadersText")
    this.leader2.position(width/3-50,130)
  }

  play() {
    //função para esconder os elementos
    this.handleResetButton();
    this.handleElements();
    //desenhar os sprites
    Player.getPlayersInfo();
    if(allPlayers!==undefined) {
     
      image(track,0,-height*5,width,height*6)
      this.showFuelBar()
      this.showLife()
      this.showLeaderboard()
      var index = 0;
      for (var plr in allPlayers) {
        index = index + 1
        var x = allPlayers[plr].positionX
        var y = height - allPlayers[plr].positionY
        var currentLife = allPlayers[plr].life
        if(currentLife <= 0 ){
          cars[index-1].changeImage("blast")
          cars[index-1].scale = 0.3

        }
        cars[index - 1].position.x = x
        cars[index - 1].position.y = y
        if(index === player.index){
          stroke(10)
          fill("yallow")
          ellipse(x,y,60,60)
          camera.position.x = cars[index-1].position.x
          camera.position.y = cars[index-1].position.y
          this.handleFuel(index);
          this.handlePowerCoins(index);
          this.handleObstacleCollision(index);
          this.handleCarACollisionWithCarB(index);
          if(player.life<=0){
            this.blast = true;
            this.playerMoving = false;
          }
        }
        if(this.playerMoving){
          player.positionY += 5;
          player.update()
        }
        

      }
    }
    this.handlePlayerControls()
    const finishLine = height*6-100
    if(player.positionY>finishLine){
      gameState = 2
      player.rank += 1
      Player.updateCarsAtEnd(player.rank)
      player.update()
      this.showRank()
      
      
    }
    drawSprites();


    
  }
    handlePlayerControls(){
      if(!this.blast){
        if(keyIsDown(UP_ARROW)){
          this.playerMoving = true;
          player.positionY += 10
          player.update()
        }
        if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
          player.positionX -= 5;
          this.leftKeyActive = true;
          player.update();
        }
        if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
          player.positionX += 5;
          this.leftKeyActive = false;
          player.update();
        }
     }
   
    }

    showLeaderboard() {
      var leader1, leader2;
      var players = Object.values(allPlayers);
      if (
        (players[0].rank === 0 && players[1].rank === 0) ||
        players[0].rank === 1
      ) {
        // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
        leader1 =
          players[0].rank +
          "&emsp;" +
          players[0].name +
          "&emsp;" +
          players[0].score;
    
        leader2 =
          players[1].rank +
          "&emsp;" +
          players[1].name +
          "&emsp;" +
          players[1].score;
      }
    
      if (players[1].rank === 1) {
        leader1 =
          players[1].rank +
          "&emsp;" +
          players[1].name +
          "&emsp;" +
          players[1].score;
    
        leader2 =
          players[0].rank +
          "&emsp;" +
          players[0].name +
          "&emsp;" +
          players[0].score;
      }
    
      this.leader1.html(leader1);
      this.leader2.html(leader2);
    }
     handleResetButton(){
      this.resetButton.mousePressed(()=>{
        database.ref("/").set({
          playerCount:0,
          gameState:0,
          players:{},
          carsAtEnd:0
        })
        window.location.reload()
      })

   }
    handleFuel(index){
      cars[index-1].overlap(fuels,function(collector,collected){
        player.fuel = 185;
        collected.remove()
      })
      if(player.fuel > 0 && this.playerMoving){
        player.fuel -=0.3
      }
      if(player.fuel <= 0 ){
        gameState = 2
        this.gameover()
      }
    }

    handlePowerCoins(index){
      cars[index-1].overlap(powerCoin,function(collector,collected){
        player.score += 21;
        player.update()
        collected.remove()
      })
    }
    showLife() {
      push();
      image(lifeImage, width / 2 - 130, height - player.positionY - 400, 20, 20);
      fill("white");
      rect(width / 2 - 100, height - player.positionY - 400, 185, 20);
      fill("#f50057");
      rect(width / 2 - 100, height - player.positionY - 400, player.life, 20);
      noStroke();
      pop();
    }
    
    showFuelBar() {
      push();
      image(fuelImage, width / 2 - 130, height - player.positionY - 350, 20, 20);
      fill("white");
      rect(width / 2 - 100, height - player.positionY - 350, 185, 20);
      fill("#ffc400");
      rect(width / 2 - 100, height - player.positionY - 350, player.fuel, 20);
      noStroke();
      pop();
    }
    gameover(){
      swal({
        title:"fim de jogo",
        text:"perdeu o jogo",
        imageUrl:"https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
        imageSize:"100x100",
        confirmButtonText:"obrigado por jogar",
      
      }) 
    }
      showRank(){
        swal({
          title:`incrivel!! ${"\n"} rank ${player.rank}`,
          text:"chegou ao final",
          imageUrl:"https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
          imageSize:"100x100",
          confirmButtonText:"obrigado por jogar",
        
        })
    }
     handleObstacleCollision(index){
      if(cars[index-1].collide(obstacles)){
        if(this.leftKeyActive){
          player.positionX+=100;
        }else{player.postionX-=100}
          if(player.life > 0){
            player.life -= 185/4;
        }
        player.update()
      }
    }
     handleCarACollisionWithCarB(index){
      if(index===1){
        if(cars[index-1].collide(cars[1])){
          if(this.leftKeyActive){
            player.positionX+=100;
          }else{player.postionX-=100}
            if(player.life > 0){
              player.life -= 300/4;
          }
          player.update()
        }
      } 
      if(index===2){
        if(cars[index-1].collide(cars[0])){
          if(this.leftKeyActive){
            player.positionX+=100;
          }else{player.postionX-=100}
            if(player.life > 0){
              player.life -= 300/4;
          }
          player.update()
        }
      }
     }

  }