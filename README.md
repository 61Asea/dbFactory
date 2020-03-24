# dbFactory
dbFactory(Node), including mongoDb, mysql, mockDB, n more

## mysql
提供了完整的工作单元机制，后续可以对事务队列的长度进行优化，如同Redis的AOF重写文件机制一样，过滤掉一些实际无效的update操作

## mongo
鉴于mongo文档的特殊性，工作单元并没有完成多文档的事务操作，可喜可贺的是，目前mongo3.6可使用新特性session，进行多文档的事务操作提交。

对于mongo此类非关系型数据库而言，更推荐的是应充分使用BSON格式的特性，在代码层面上对保存对象进行设计，以单文档操作形式来避免使用多文档事务

## mock
可以模拟任意实现了Base基类的数据库工厂类

在使用前对需要模拟的表名或文档名进行映射，where形参格式由不同的数据库工厂决定，此时断言将会模拟数据库的查询语句
	mock.RegisterWhere(table, where) {}
