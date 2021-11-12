import React, { useState } from 'react';
import './style.scss';

interface IProps {
  getFieldDecorator: any;
  validateFields: any;
}
const UserForm = (props: IProps) => {
  const { getFieldDecorator, validateFields } = props;
  const [userInfo, setUserInfo] = useState({
    name: '',
    nickName: '琉易',
  });

  const handleSava = () => {
    validateFields((err, values) => {
      if (err) {
        console.log('验证不通过', err);
      } else {
        console.log('验证通过', values);
        setUserInfo(values);
      }
    });
  };

  return (
    <div className="user-form">
      {getFieldDecorator('name', {
        initialValue: userInfo.name,
        rules: [{ required: true, message: '姓名不可为空！' }],
      })(<input className="input" placeholder="请输入姓名" />)}
      {getFieldDecorator('nickName', {
        initialValue: userInfo.nickName,
        rules: [{ required: true, message: '花名不可为空！' }],
      })(<input className="input" placeholder="请输入花名" />)}
      <button className="btn" onClick={handleSava}>
        保 存
      </button>
    </div>
  );
};

const createForm = (FormFunc) => (props) => {
  const [formData, setFormData] = useState({});
  const [errObj, setErrObj] = useState({});
  const rules = {};
  /**
   * 实现 getFieldDecorator 方法
   * 初始化时将 initialValue 赋值给输入框的 value
   * 输入框变化时可以拿到 value
   */
  const getFieldDecorator = (key: string, options: any) => {
    // 判断是否第一次赋值，避免死循环
    const first = Object.keys(formData).indexOf(key) === -1;

    if (options.rules) {
      rules[key] = [...options.rules];
    }
    if (first && options.initialValue) {
      setFormData({ ...formData, [key]: options.initialValue });
    }

    return (formItem) => {
      if (errObj[key]) {
        formItem = {
          ...formItem,
          props: { ...formItem.props, className: 'input err' },
        };
      }
      return (
        <div className="form-item">
          {React.cloneElement(formItem, {
            name: key,
            value: formData[key] || '',
            onChange: (e: any) => {
              // 输入框值变化时去除错误提示
              setErrObj({ ...errObj, [key]: '' });
              setFormData({ ...formData, [key]: e.target.value });
            },
            onBlur: () => {
              // 当前默认 blur 时进行校验
              validateFields();
            },
          })}
          <div className="err-text">{errObj[key] || ' '}</div>
        </div>
      );
    };
  };

  // 绑定校验方法
  const validateFields = (cb?: any) => {
    let errObjTemp = {};
    Object.keys(rules).forEach((key) => {
      rules[key].forEach((rule) => {
        if (rule?.required && (!formData[key] || formData[key].trim() === '')) {
          errObjTemp = {
            ...errObjTemp,
            [key]: rule?.message || `${key}为必填项！`,
          };
          setErrObj(errObjTemp);
        }
      });
    });
    cb && cb(Object.keys(errObjTemp).length ? errObjTemp : undefined, formData);
  };

  // 将自定义方法挂载到 props 上
  return FormFunc({ ...props, getFieldDecorator, validateFields });
};

export default createForm(UserForm);
