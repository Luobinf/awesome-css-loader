const valueParser = require("postcss-value-parser");
const { WEBPACK_IGNORE_COMMENT_REGEXP } = require("../utils");


// 用于解析例如 background-image: url('./image.png');
function parseDeclaration(declaration, key, result, options) {
	const value = declaration[key];
	if(!value) {
		return
	}
	const parsed = valueParser(value)

	// if(nodes && nodes.length === 0) {
	// 	return
	// }

	// const node = nodes[0];

	// if(node.type !== "function" || node.value !== 'url') {
	// 	return
	// }

	// console.log(88888);
	// console.log(node);
	// 例如： background-image: url();
	// if(node.nodes && node.nodes.length === 0) {
	// 	return
	// }

	// 需要验证 node.nodes.value 的合法性
	
  let isIgnoreDeclaration = false;

	const prevNode = declaration.prev()

	if(prevNode && prevNode.type === "comment") {
		const matched = prevNode.text.match(WEBPACK_IGNORE_COMMENT_REGEXP)
		if(matched) {
			isIgnoreDeclaration = matched[2] === 'true'
		}
	}

	parsed.walk((valueNode, index, valueNodes) => {
		console.log(88888);
		console.log(valueNode, index, valueNodes)

		const { nodes } = valueNode
		
	})

	// console.log(88888);
	// console.log(prevNode)

}

module.exports = function (options = {}) {
  return {
    postcssPlugin: "postcss-url-parser",
    Once(root) {
      // Plugin code
      console.log("进来了");
    },
    prepare(result) {
      const parsedDeclarations = [];
      return {
        Declaration(declaration) {
          
          // console.log(declaration);
          const parsedURL = parseDeclaration(declaration, "value", result, {});
          if (!parsedURL) {
            return;
          }
          parsedDeclarations.push(parsedURL);
        },
        OnceExit() {
          console.log("做点什么呢???");
        },
      };
    },
  };
};

module.exports.postcss = true;

var a = {
  code: 200,
  data: {
    ruleMode: 2,
    rewardRule: 0,
    voucherAmount: 0.0,
    stime: 1658737409000,
    showMileageDetail: 0,
    riskType: 3,
    voucherId: 0,
    feeDoubtMemo: "",
    originalTotalMoney: 30.0,
    platformPaid: 0.0,
    realTotalMoney: "30.0",
    mileage: 0,
    reward: 0.0,
    paiedFee: 30.0,
    totalMoney: 30.0,
    feeMemo: "合计费用",
    h5PrepayPaidFee: 30.0,
    ruleIdStr: "9bec618912c2f61d",
    payChannelDesc: "现金",
    driveTime: 27,
    etime: 1658737436000,
    feeItems: [
      {
        processList:
          '[{"amount":30.0,"distance":6000.0,"name":"起步费","ruleBeginStairs":"00:00:00","ruleEndStairs":"23:59:59","splitList":[{"distance":6000.0,"money":30.0}]}]',
        label: "起步价",
        type: 3,
        money: 30.0,
        detail: "(含6公里)",
      },
      {
        processList:
          '[{"amount":0,"distance":0.0,"name":"免等候时间","seconds":77,"sortNum":-1,"splitList":[{"beginStairs":"2022-07-25 16:22:12","distance":0.0,"endStairs":"2022-07-25 16:23:29","name":"行程前等候","order":-1,"seconds":77}]}]',
        label: "等候费",
        type: 2,
        money: 0,
        detail: "(超免费等候0分钟)",
      },
      { label: "其他费用", type: 5, money: 900, detail: "(不支持代金券抵扣)" },
    ],
    feeDoubtValid: 0,
  },
  msg: "操作成功",
  subcode: 200,
  traceId: "0a4ab21d6336845e7f3b62cb67cb5e02",
}
