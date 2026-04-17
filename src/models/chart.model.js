import mongoose from "mongoose";
const chartSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true 
    },
    userId:{
        type:String,
        required:true,
        unique:true
    },
    allchart:[{
      name:{
        type:String,
        
      },
      d1Chart:{
        type:Object,
      },
      d4Chart:{
        type:Object,
      },
      d9Chart:{
        type:Object,
      },
      d10Chart:{
        type:Object,
      },
      d8Chart:{
        type:Object,
      },
      d1ChartImage:{
        type:String,
      },
      d4ChartImage:{
        type:String,
      },
      d9ChartImage:{
        type:String,
      },
      d10ChartImage:{
        type:String,
      },
      d8ChartImage:{
        type:String,
      },
       shadbala:{
        type:Object,
      },
      dashatimings:{
        type:Object,
      },
      allChartDataString:{
        type:String,
        required:true
      }
     
    }]
})
const Chart=mongoose.model("Chart",chartSchema);
export default Chart;