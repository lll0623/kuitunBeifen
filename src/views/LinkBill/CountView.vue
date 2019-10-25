<template>
<div class="index-wrapper">
  <div id="container" class="CountView">
    <div class="formView">
      <div class="row">
        <div class="title">
          单据编号
        </div>
        <div class="content">
			{{ this.formData.Code }}
        </div>
      </div>
      <div class="row">
        <div class="title">
          联系时间
        </div>
        <div class="content">
            {{ this.formData.Date | dateFormat}}
        </div>
      </div>
      <div class="row">
        <div class="title">
          业户地址
        </div>
        <div class="content">
          {{ this.formData.PStructName }}
        </div>
      </div>
      <div class="row">
        <div class="title">
          联系内容
        </div>
        <div class="content">
          {{ this.formData.Content }}
        </div>
      </div>
      <div class="row">
        <div class="title">
          工单状态
        </div>
        <div class="content">
			<span v-if="this.formData.State == 0" class="label label-dtj">未提交</span>
  		    <span v-if="this.formData.State == 1" class="label label-warning">待处理</span>
  		    <span v-if="this.formData.State == 2" class="label label-primary">跟进中</span>
  		    <span v-if="this.formData.State == 3" class="label label-success">已完成</span>
  		    <span v-if="this.formData.State == 4" class="label label-danger">已退单</span>
  		    <span v-if="this.formData.State == 5" class="label label-default">不处理</span>
        </div>
      </div>
    </div>

    <div class="files" v-show="imgLists.length>0">
      <img v-for="(item,index) in imgLists" :src="item.url" @click="handleView(item.url)">
    </div>

    <el-collapse v-model="activeName" accordion>
      <el-collapse-item name="1">
        <template slot="title">
            &nbsp;&nbsp;<i class="header-icon el-icon-info"></i>&nbsp;&nbsp;沟通记录
        </template>
        <div class="tr liuyan" @click="popupVisible = true">
			我要留言>>
		</div>
		<div v-for="(item,index) in MsgList" :key="index">
			<div class="liuyanTitle">
				<div class="fl">{{ item.SourceMan }}</div>
				<div class="fr">{{ item.Date | dateFormat}}</div>
			</div>
			<div class="liuyanContent">
				{{ item.MsgContent }}
			</div>
		</div>
      </el-collapse-item>
      <!-- <el-collapse-item name="2">
		  <template slot="title">
              &nbsp;&nbsp;<i class="fa fa-user-plus"></i>&nbsp;&nbsp;派单情况
          </template>
		  <div class="row">
            <div class="title">
              派单人
            </div>
            <div class="content">
              KHLX00004143
            </div>
          </div>
      </el-collapse-item> -->
        <el-collapse-item name="3">
		    <template slot="title">
                &nbsp;&nbsp;<i class="fa fa-comments-o"></i>&nbsp;&nbsp;完成情况
            </template>
			<div class="row">
	          <div class="title">
	            完成时间
	          </div>
	          <div class="content">
	            {{  this.formData.CompleteDate | dateFormat }}
	          </div>
	        </div>
			<div class="row">
	          <div class="title">
	            完成人
	          </div>
	          <div class="content">
	            {{  this.formData.CompleteUserName }}
	          </div>
	        </div>
			<div class="row">
	          <div class="title">
	            完成说明
	          </div>
	          <div class="content">
	            {{  this.formData.CompleteMemo }}
	          </div>
	        </div>
      </el-collapse-item>
    </el-collapse>
	<mt-popup
		v-model="popupVisible"
		popup-transition="popup-fade"
		position="bottom"
		modal=true>
		<p class="header tc">我要留言</p>
		<div class="liuyanMessage">
			<textarea @blur.prevent="changeLiuYan()" rows="8" cols="80" v-model="Content" placeholder="输入您给我们的留言"></textarea>
		</div>
		<div class="buttonDiv">
			<mt-button size="large" class="close fl" @click="popupVisible = false">关闭</mt-button>
			<mt-button size="large" class="submit fl" @click="submitLiuyan">提交</mt-button>
		</div>
	</mt-popup>

    <mt-popup
      v-model="popupVisibleVisit"
      popup-transition="popup-fade"
      position="bottom"
      modal=true>
      <p class="header tc">评价</p>
      <el-rate v-model="Level" :texts="['非常不满意，各方面都很差','不满意，比较差','一般，还需改善','比较满意，仍可改善','非常满意，无可挑剔']" show-text></el-rate>
      <div class="liuyanMessage">
          <textarea @blur.prevent="changeLiuYan()" rows="4" cols="80" v-model="VisitMemo" placeholder="输入您对我们的批评或建议"></textarea>
      </div>
      <div class="buttonDiv">
          <mt-button size="large" class="close fl" @click="popupVisibleVisit = false">关闭</mt-button>
          <mt-button size="large" class="submit fl" @click="subVisit()">提交</mt-button>
      </div>
    </mt-popup>
  </div>
</div>
</template>
<script type="es6">
import moment from 'moment'
//util
import {setCookie,getCookie,delCookie} from '../../util'
import { getBillDetail,addMsg,visit,queryPubRoomRelaInfoList } from '../../api/api.js'
import defaultImg from '../../assets/images/room_default.jpg'
import {
  isNull
} from '../../util'
import {
  Loadmore
} from 'mint-ui'
import {
  Toast
} from 'mint-ui'
import {
  Cell
} from 'mint-ui';
import wx from 'weixin-js-sdk'
export default {

  data() {
    return {
      defaultImg: defaultImg,
	  Content:"",
	  formData:{},
	  imgList:[],
	  imgLists:[],
      roomList:[], // 用户所绑定的房间列表
      CmpCode:"",
	  MsgList:[],
	  activeName:"1",
      Level:1,
      VisitMemo:"",
	  popupVisible:false,
      popupVisibleVisit:false

    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      window.document.title = "联系单详情";
      document.body.style.backgroundColor = '#efefef'
    })
  },
  activated() {
	  this.GetView();
      queryPubRoomRelaInfoList({}).then(res =>{
          if(res.Status == 200){
              this.roomList = res.Data;
          }else {
              Toast({
                  message: res.Message,
                  position: 'top',
                  iconClass: 'fa fa-close',
                  duration: 3000
              });
          }
      })
  },
  methods: {
	  GetView(){
		  var parm = {
			  BillId:this.$route.query.BillId
		  }
		  getBillDetail(parm).then(res =>{
			  console.log(res);
			  if(res.Status == 200){
                  this.popupVisibleVisit = res.Data.IsNeedVisit; // 评价框弹出
				  this.formData = res.Data;
				  this.imgList = res.Data.Files;
				  this.MsgList = res.Data.MsgList
				  var sss= []
                  let ImageDomain = ""
                  if(getCookie("ImageDomain")){
                      ImageDomain = getCookie("ImageDomain");
                  }
				  this.imgList.forEach(function (c) {
					  sss.push({
						  url:ImageDomain + c
					  })
          			})
					this.imgLists = sss;
					  // console.log(this.imgLists);
			  }else {
				  Toast({
					  message: res.Message,
					  position: 'top',
					  iconClass: 'fa fa-close',
					  duration: 3000
				  });
			  }
		  })
	  },
      handleView(file) {
          var array = [];
          array.push(file);
          wx.previewImage({
              current: file, // 当前显示图片的http链接
              urls: array // 需要预览的图片http链接列表
          });
      },
      changeLiuYan() {
          document.body && (document.body.scrollTop = document.body.scrollTop);
      },
	  submitLiuyan() {
          var obj = [],value8 = getCookie("PStructId");
          obj = this.roomList.filter(item => value8 == item.PStructId)
          this.CmpCode = obj[0].CmpCode;
		  var parm = {
              cmpCode:this.CmpCode,
			  BillId:this.$route.query.BillId,
			  MsgContent:this.Content
		  }
		  addMsg(parm).then(res =>{
			  // console.log(res);

			  if(res.Status == 200){
				  Toast({
					  message: '留言成功！',
					  position: 'middle',
					  iconClass: 'fa fa-check',
					  duration: 3000
				  });
				  this.Content = "";
				  this.popupVisible = false;
				  this.GetView();
			  }else {
				  Toast({
					  message: res.Message,
					  position: 'top',
					  iconClass: 'fa fa-close',
					  duration: 3000
				  });
			  }
		  })
	  },
      /// 评价功能
      subVisit(){
          if(this.VisitMemo == ""){
              Toast({
                  message: '请输入您的评价！',
                  position: 'middle',
                  iconClass: 'fa fa-warning',
                  duration: 3000
              });
              return;
          }
          var parm = {
			  BillId:this.$route.query.BillId,
              Level:this.Level,
			  VisitMemo:this.VisitMemo
		  }
		  visit(parm).then(res =>{
			  console.log(res);
			  if(res.Status == 200){
				  Toast({
					  message: '评价成功！',
					  position: 'middle',
					  iconClass: 'fa fa-check',
					  duration: 3000
				  });
				  this.VisitMemo = "";
				  this.popupVisibleVisit = false;
				  this.GetView();
			  }else {
				  Toast({
					  message: res.Message,
					  position: 'top',
					  iconClass: 'fa fa-close',
					  duration: 3000
				  });
			  }
		  })
      }
  },
  filters:{
	  //时间格式化
	  dateFormat:function(date) {
		  if (date == undefined) {
			 return "";
		  }
		  //moment.locale('en'); //日期格式汉化
		  var localLocale = moment(date).utcOffset(480).format('YYYY-MM-DD HH:mm:ss');
		  return localLocale;
	  }
  }
}
</script>
<style lang="scss">
body {
    background-color: #efefef;
}
.CountView {
    background-color: #efefef;
    padding: 0.15rem;
    .formView {
        background-color: white;
        border: 1px solid #ddd;
        padding: 0.2rem;
        box-shadow: 0 1px 3px rgba(0,0,0,.1);
        .row {
			margin-bottom: 0.1rem;
		    border-bottom: 1px solid #ddd;
		    padding: 2%;
		    line-height: 0.5rem;
		    display: inline-block;
		    width: 96%;
            .title {
                text-align: left;
                width: 2rem;
                position: relative;
                float: left;
                color: #808080;
            }
            .content {
                margin: 0 0 0 2rem;
                font-size: 0.35rem;
            }
        }
    }
    .files {
        background-color: white;
        padding: 0.2rem 0.15rem 0.3rem;
        display: inline-block;
        border: 1px solid #ddd;
        margin-top: 0.2rem;
		margin-bottom: 0.1rem;
        box-shadow: 0 1px 3px rgba(0,0,0,.1);
		width: 96%;
        img {
            float: left;
            width: 23%;
            height: 2rem;
            margin-right: 2%;
        }
    }
	.el-collapse-item__content{
		padding: 0rem 0.4rem 0.4rem 0.4rem;
		.liuyan{
			color:blue;
			width:100%;
		}
		.liuyanTitle{
			margin-top: 0.2rem;
			border-bottom: 1px dashed #ddd;
			width: 100%;
			display: inline-block;
			padding-bottom: 0.2rem;
		}
		.liuyanContent{
			border-bottom: 1px solid #ddd;
			width: 100%;
			display: inline-block;
			padding-bottom: 0.2rem;
			margin-bottom: 0.4rem;
		}
		.row {
			margin-bottom: 0.1rem;
		    border-bottom: 1px solid #ddd;
		    padding: 2%;
		    line-height: 0.5rem;
		    display: inline-block;
		    width: 96%;
            .title {
                text-align: left;
                width: 2rem;
                position: relative;
                float: left;
                color: #808080;
            }
            .content {
                margin: 0 0 0 2rem;
                font-size: 0.35rem;
            }
        }
	}
	.mint-popup-bottom{
		z-index: 2007;
		width: 101%;
		height: 10rem;
		background: #eee;
		.header{
			color: #000;
			font-size: 0.45rem;
			margin: 0.3rem 0.2rem 0.4rem 0.2rem;
            border-bottom: 1px solid #ccc;
            padding-bottom: 0.25rem;
		}
        .el-rate{
            text-align: center;
            position: relative;
            padding-bottom: 1.5rem;
            .el-rate__icon{
                font-size: 1rem;
            }
            .el-rate__text{
                position: absolute;
                top: 1.2rem;
                width: 100%;
                left: 0;
            }
        }
		.liuyanMessage{
			background: white;
			text-align: center;
			textarea{
				margin: 0.5rem;
				width: 8.8rem;
				background: white;
				border: 1px solid #eee;
			}
		}
		.buttonDiv{
			margin: 0rem auto;
			text-align: center;
			display: inline-block;
			position: fixed;
			width: 100%;
			bottom: 0.2rem;
			.close{
				width: 20%;
				margin-left: 7%;
			}
			.submit{
				width: 65%;
				background: #ff6600;
				color: white;
			}
		}
		button{
			display: inherit;
		}
	}
}
</style>
