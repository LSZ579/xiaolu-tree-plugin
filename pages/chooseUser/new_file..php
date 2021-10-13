<?php
/**
 * Created by PhpStorm.
 * User: lsz
 * Date: 2020/10/7
 * Time: 13:57
 */

namespace app\api\controller\v1;
use app\api\model\Avatar as AvatarModel;
use app\api\model\AvatarLike as AvatarLikeModel;

use app\api\controller\BaseController;
use think\Db;
use think\Cache;
use app\lib\exception\UserException;
use app\api\service\Token as TokenService;
use app\api\model\User as UserModel;

class Avatar extends BaseController
{

    protected $beforeActionList=[
        'checkPrimaryScope'=>['only'=>'s']
    ];
    /*首页*/
    public function getIndexAvatar($limit,$page){
        $result=AvatarModel::getIndexAvatar($limit,$page);
      //  $result=curl_get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxc9224d8fe5f2c62d&secret=3595136c966af801f40709a8ff18453c');
        return $result;
    }
    //主题头像
    public function getThemAvatar($limit,$page,$keyword){
        $result=AvatarModel::getThemAvatar($limit,$page,$keyword);
        return $result;
    }
    //主题头像详情
    public function getThemAvatarItem($limit,$page,$id){
        $result=AvatarModel::getThemAvatarItem($limit,$page,$id);
        return $result;
    }
    public function checkLike($id){
        $uid=TokenService::getCurrentUid();
        $user=UserModel::get($uid);
        if (!$user){
            throw new UserException();
        }
        $isLike=Db::table('avatar_like')
            ->where('user_id','=',$uid)
            ->where('avatar_id','=',$id)->find();
        if($isLike['like']){
            return $isLike['like'];
        }else{
            return 0;
        }
        
    }
    /*点赞或不点赞*/
    public function avatarLike($id,$type){
        $uid=TokenService::getCurrentUid();
        $user=UserModel::get($uid);
        if (!$user){
            throw new UserException();
        }
        $isLike=Db::table('avatar_like')
            ->where('user_id','=',$uid)
            ->where('avatar_id','=',$id)->find();
        if($isLike){
            $update=Db::table('avatar_like')
                ->where('user_id','=',$uid)
                ->where('avatar_id','=',$id)->update(['like'=>$isLike['like']==1?0:1]);
            return $isLike['like']?0:1;
        }else {
            $data = [
                'user_id' => $uid,
                'avatar_id' => $id,
                'like' => 1,
                'types'=>$type,
                'add_time'=> date('Y-m-d H:i:s',time())
            ];
            $insert = Db::table('avatar_like')->insert($data);
            if($insert){
                return $isLike['like']?0:1;
            }
        }
    }
    public function getLikeCount($id){
        $res=Db::name('avatar_like')
            ->where('avatar_id',$id)
            ->where('like',1)
            ->select();
        return count($res);
    }
    /*获取我的收藏列表*/
    public function getMyCollect($limit,$page){
        $res=AvatarLikeModel::getCollect($limit,$page);
        return $res;
    }
    /*获取我的收藏列表*/
    public function getMypicture($limit,$page){
        $res=AvatarLikeModel::getMypicture($limit,$page);
        return $res;
    }
    public function getTypeAvatar($type,$limit,$page){
        $result=Db::name('avatar')->where('category_id','=',$type)
            ->paginate($limit,false,['page'=>$page]);

        //$result=Db::name('avatar')->where('category_id','=',$type)->paginate($limit,false,['page'=>$page]);
        return $result;

    }

    /*查找*/
    public function searchAvatar($keyword,$limit,$page){
        $result=Db::name('avatar')->where('them','LIKE',"%".$keyword."%")
            ->paginate($limit,false,['page'=>$page]);
        $res=$this->keywordCount($keyword);
        //$result=Db::name('avatar')->where('category_id','=',$type)->paginate($limit,false,['page'=>$page]);
        return $result;
    }
    /*获取热门搜索关键字*/
    public function getHotKeyword($type){
        $res=Db::name('keyword')->where('type','=',$type)->order('count desc')->limit(30)->select();
        return $res;
	//return [];
    }
    public function keywordCount($content){
//        ->where('keyword','LIKE',"%".$content."%")
        $result=Db::name('keyword')->where('keyword',$content)->where('type',1)->find();
        if($result) {
            $res = Db::name('keyword')->where('id', $result['id'])->setInc('count');
        }else{
            $insert=Db::name('keyword')->insert(['keyword'=>$content,'count'=>1,'type'=>1]);
        }
    }
    /*管理后台上传头像*/
    public function upload(){
        $file = request()->file('file');
        $type = request()->param('type');
        $type_id=request()->param('type_id');
        $info = $file->rule('uniqid')->validate(['size'=>1567008,'ext'=>'jpg,png,gif'])->move(ROOT_PATH . 'public/avatar/'.$type);
        if($info){
           $fileName=$info->getFilename();//文件名
            $data=[
                'url'=>'/public/avatar/'.$type.'/'.$fileName,
                'category_id'=>$type_id
            ];
            $insert=Db::name('avatar')->insert($data);
            return ['code'=>200];
        }else{
            // 上传失败获取错误信息
            echo $file->getError();
        }
    }
	public function treeData(){
		$file = file_get_contents(config('setting.img_prefix')."/tree.txt");
		$str_encoding = mb_convert_encoding($file, 'UTF-8', 'UTF-8,GBK,GB2312,BIG5,GB18030');
		return  $str_encoding;
	}
}